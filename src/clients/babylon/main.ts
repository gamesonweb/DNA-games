import { Engine, FollowCamera, Vector3 } from "babylonjs";
import { username, wsClient } from "../connection/connectionClient";
import { windowExists } from "../reactComponents/tools";
import { Player } from "./avatars/heroes/player";

import { inializeInputListeners as initializeInputListeners, inputEffects } from "./avatars/inputListeners";
import { adjustCameraPosition } from "./others/tools";
import { SceneClient } from "./scene/sceneClient";

export var canvas: HTMLCanvasElement;
export var engine: Engine;
export var scene: SceneClient;
export var sphere1: Player | undefined;

let doneOnce = false;

export var startRenderLoop = function (engine: Engine) {
  setInterval(() => {
    console.log(engine.getFps().toFixed() + " fps")
    console.log("state: " + sphere1?.getStatus());

  }, 2000)
  engine.runRenderLoop(function () {
    if (scene && scene.activeCamera) {
      scene.render();
      scene.projectileList.forEach(e => e.update())
      if (sphere1) inputEffects(sphere1)
      if (sphere1) adjustCameraPosition(scene, sphere1)
      // console.log(engine.getFps().toFixed() + " fps");
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
  console.log("Loading screen");

  if (!engine) throw new Error('engine should not be null.');
  //startRenderLoop(engine, canvas);

  let scene = new SceneClient(engine);
  scene.skipPointerMovePicking = true
  //scene.assetManager?.load();
  //Here load all models

  setWindowParams()
  initializeInputListeners();
  return scene
};

export function set_my_sphere() {
  sphere1?.dispose();
  console.log("Setting sphere");

  let player_sphere = wsClient.player_list.get(username);
  if (player_sphere) {
    //scene.setActiveCameraByName(player_sphere.cameraAvatar.name)
    sphere1 = player_sphere;

    let cameraBuilder = new FollowCamera(sphere1.name + "Camera", sphere1.shape.position.multiply(new Vector3(1, -1, 1)), scene, sphere1.shape);
    cameraBuilder.rotationOffset = 180;
    // cameraBuilder.maxZ = 100;
    scene.activeCamera = cameraBuilder;


  }
}

export function setScene(e: SceneClient | undefined) {
  if (e === undefined) {
    throw new Error("Undefined Scene")
  } else {
    scene = e
  }
}

declare global {
  interface Window {
    playerList: Map<string, Player>,
    scene: SceneClient,
    engine: Engine
    BABYLON: any;
  }
}

function setWindowParams() {
  if (windowExists()) {
    window.playerList = wsClient.player_list;

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });
    window.engine = engine;

    window.scene = scene;
  }
}
