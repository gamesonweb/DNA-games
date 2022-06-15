import { Engine, FollowCamera, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { Avatar } from "./avatar";
import { connect_to_ws, player_list, username } from "./connectionWS";

var canvas: HTMLCanvasElement;
var engine: Engine;
export var scene: Scene;
export var sphere1: Avatar | undefined;
let doneOnce = false;

var startRenderLoop = function (engine: Engine, canvas: HTMLCanvasElement) {
  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
      player_list.forEach(e => e.updateBulletPosition())
    }
  });
  engine.resize()
}

var createDefaultEngine = function () { return new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = function () {

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new Scene(engine!);
  window.scene = scene;

  // This creates and positions a free camera (non-mesh)
  var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  sphere1 = new Avatar(scene, "Well");

  // Our built- shape. Params: name, width, depth, subdivs, scene
  var ground = MeshBuilder.CreateGround("ground1", { width: 10, height: 10, subdivisions: 2 }, scene);

  return scene;

};

export let initFunction = async function () {
  if (doneOnce) return;
  doneOnce = true
  canvas = document.getElementById("canvas") as HTMLCanvasElement

  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.error("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  engine = await asyncEngineCreation();
  window.engine = engine;
  if (!engine) throw new Error('engine should not be null.');
  startRenderLoop(engine, canvas);
  let scene = createScene();

  connect_to_ws();

  // HERE PLAYER-X SENDS A REQUEST TO THE SERVER PASSING evt.key
  // THE SERVER MUST SENDS THE NOTIFICATION TO MOVE THE AVATAR-X
  // OF evt.key. That means AVATARS[PLAYER-X].move(evt.key)
  canvas.onkeydown = evt => sphere1?.move(evt.code)
  return scene
};

export function set_my_sphere() {
  sphere1?.dispose();
  let player_sphere = player_list.get(username);
  if (player_sphere) {
    //scene.setActiveCameraByName(player_sphere.cameraAvatar.name)
    sphere1 = player_sphere;
    let cameraBuilder = new FollowCamera(sphere1.name + "Camera", sphere1.position.multiply(new Vector3(1, -1, 1)), scene, sphere1);
    cameraBuilder.rotationOffset = 180;
    scene.activeCamera = cameraBuilder;
  }
}


initFunction().then(e => {
  scene = e!
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});

declare global {
  interface Window {
    addAvatar: (() => Avatar),
    playerList: Map<string, Avatar>,
    scene: Scene,
    engine: Engine
    BABYLON: any;
  }
}

window.BABYLON = BABYLON;
//window.addAvatar = (avatar_username: String) => addAvatar(scene, avatar_username)