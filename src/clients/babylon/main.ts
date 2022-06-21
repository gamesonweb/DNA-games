import { Engine, FollowCamera, Scene, Vector3 } from "babylonjs";
import { player_list, username } from "../connectionWS";
import { Avatar } from "./avatars/avatar";

import { inializeInputListeners } from "./inputListeners";
import { MyScene } from "./scene";

export var canvas: HTMLCanvasElement;
export var engine: Engine;
export var scene: Scene;
export var sphere1: Avatar | undefined;

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
  // engine.displayLoadingUI();

  // Resize
  window.addEventListener("resize", function () {
    engine.resize();
  });
  window.engine = engine;
  if (!engine) throw new Error('engine should not be null.');
  startRenderLoop(engine, canvas);

  let scene = new MyScene();

  inializeInputListeners();
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

export function setScene(e: Scene | undefined) {
  if (e === undefined) {
    throw new Error("Undefined Scene")
  } else {
    scene = e
  }
}

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

function initChat() {
  throw new Error("Function not implemented.");
}
