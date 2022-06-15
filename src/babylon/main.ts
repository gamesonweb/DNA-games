import { Engine, FreeCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { addAvatar, Avatar } from "./avatar";
import { connect_to_ws, player_list, username } from "./connectionWS";

var canvas: HTMLCanvasElement;
var engine: Engine;
export var scene: Scene;
var sceneToRender: Scene;
export var sphere1: Avatar;
let doneOnce = false;

var startRenderLoop = function (engine: Engine, canvas: HTMLCanvasElement) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var createDefaultEngine = function () { return new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = function () {

  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new Scene(engine!);

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

  sphere1 = new Avatar(scene, "");

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
  if (!engine) throw new Error('engine should not be null.');
  startRenderLoop(engine, canvas);
  scene = createScene();

  connect_to_ws();

  // HERE PLAYER-X SENDS A REQUEST TO THE SERVER PASSING evt.key
  // THE SERVER MUST SENDS THE NOTIFICATION TO MOVE THE AVATAR-X
  // OF evt.key. That means AVATARS[PLAYER-X].move(evt.key)
  canvas.onkeydown = evt => sphere1.move(evt.key)
  window.avatar = sphere1
};

export function set_my_sphere() {
  if (sphere1) sphere1.dispose();
  let player_sphere = player_list.get(username);
  if (player_sphere != undefined) sphere1 = player_sphere;
}


initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});

declare global {
  interface Window {
    addAvatar: (() => Avatar),
    avatar: Mesh
  }
}

//window.addAvatar = (avatar_username: String) => addAvatar(scene, avatar_username)