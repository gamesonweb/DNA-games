import { Color3, Engine, FollowCamera, FreeCamera, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { canvas, engine, sphere1, scene } from "./main";

export var light: HemisphericLight;

export function createScene() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine!);
    window.scene = scene;

    createCamera()
    createLight()
    createGround()
    createWall()

    // sphere1 = new Avatar(scene, "Well", "");

    scene.collisionsEnabled = true;
    scene.beforeRender = () => {
        sphere1?.moveWithCollisions(new Vector3(0, -0.5, 0))
    }

    return scene;
};

function createCamera() {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
}

function createLight() {
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
}

function createGround() {
    // Our built- shape. Params: name, width, depth, subdivs, scene
    var ground = MeshBuilder.CreateGround("ground1", { width: 50, height: 50, subdivisions: 2 }, scene);
    ground.checkCollisions = true;

}

function createWall() {
    let wall = MeshBuilder.CreateBox("wall", { size: 2 }, scene);
    wall.position = new Vector3(1, 1, 5)
    wall.checkCollisions = true;

    var wallMaterial = new StandardMaterial("wallMat", scene);

    wallMaterial.diffuseColor = new Color3(1, 0, 0);
    wall.material = wallMaterial;
}