import { Engine, FollowCamera, Scene, Vector3, Ray } from "babylonjs";
import { initChat } from "../reactComponents/chat";
import { Avatar } from "./avatar";
import { connect_to_ws, player_list, username } from "./connectionWS";

import { inializeInputListeners } from "./inputListeners";
import { createScene } from "./scene";

export var canvas: HTMLCanvasElement;
export var engine: Engine;
export var scene: Scene;
export var sphere1: Avatar | undefined;
export var ray: Ray;
let doneOnce = false;

var startRenderLoop = function (engine: Engine, canvas: HTMLCanvasElement) {
  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
      player_list.forEach(e => e.updateBulletPosition())
      sphere1?.move();
    }
  });
  engine.resize()
}

var createDefaultEngine = function () { return new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

export let initFunction = async function () {
  if (doneOnce) return
  doneOnce = true
  canvas = document.getElementById("canvas") as HTMLCanvasElement

  initChat();

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

  inializeInputListeners();

  connect_to_ws();

  // HERE PLAYER-X SENDS A REQUEST TO THE SERVER PASSING evt.key
  // THE SERVER MUST SENDS THE NOTIFICATION TO MOVE THE AVATAR-X
  // OF evt.key. That means AVATARS[PLAYER-X].move(evt.key)

  //canvas.onkeydown = evt => sphere1?.move(evt.code, evt)

  return scene
};

export function set_my_sphere() {
  sphere1?.dispose();
  let player_sphere = player_list.get(username);
  if (player_sphere) {
    //scene.setActiveCameraByName(player_sphere.cameraAvatar.name)
    sphere1 = player_sphere;
    ray = new Ray(sphere1.position, new Vector3(0, -1, 0), 1.2);

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