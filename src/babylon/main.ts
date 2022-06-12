import { Engine, FreeCamera, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs";

var canvas: HTMLCanvasElement;
var engine: Engine;
var scene: Scene;
var sceneToRender: Scene;

var startRenderLoop = function (engine: Engine, canvas: HTMLCanvasElement) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
}

var createDefaultEngine = function () { return new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

var createScene = function () {

  console.log({ engine, canvas });


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

  // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
  var sphere = MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);

  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;

  // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
  var ground = MeshBuilder.CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene);

  return scene;

};

export let initFunction = async function () {
  canvas = document.getElementById("canvas") as HTMLCanvasElement
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
    }
  }

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  startRenderLoop(engine, canvas);
  scene = createScene();
};


initFunction().then(() => {
  sceneToRender = scene
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
