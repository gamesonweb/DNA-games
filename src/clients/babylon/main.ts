import { Engine, FollowCamera, Vector3 } from "babylonjs";
import { player_list, username } from "../connectionWS";
import { windowExists } from "../reactComponents/tools";
import { Player } from "./avatars/player";

import { inializeInputListeners } from "./inputListeners";
import { MyScene } from "./scene";

export var canvas: HTMLCanvasElement;
export var engine: Engine;
export var scene: MyScene;
export var sphere1: Player | undefined;

let doneOnce = false;

export var startRenderLoop = function (engine: Engine) {
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

  // initChat();

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

  if (!engine) throw new Error('engine should not be null.');
  //startRenderLoop(engine, canvas);

  let scene = new MyScene();
  scene.assetManager.load();

  setWindowParams()
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

export function setScene(e: MyScene | undefined) {
  if (e === undefined) {
    throw new Error("Undefined Scene")
  } else {
    scene = e
  }
}

declare global {
  interface Window {
    playerList: Map<string, Player>,
    scene: MyScene,
    engine: Engine
    BABYLON: any;
  }
}

function setWindowParams() {
  if (windowExists()) {
    window.playerList = player_list;

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });
    window.engine = engine;

    window.scene = scene;
  }
}
