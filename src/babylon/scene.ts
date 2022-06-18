import { Color3, Engine, FollowCamera, FreeCamera, HemisphericLight, MeshBuilder, Scene, StandardMaterial, Vector3, Axis, GroundMesh, Mesh } from "babylonjs";
import { canvas, engine, sphere1, scene } from "./main";

export var light: HemisphericLight;
export var ground: GroundMesh;
export var wall: Mesh;
export function createScene() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine!);
    window.scene = scene;

    createCamera()
    createLight()
    createGround()
    createWall()

    setPhysics(scene)

    // sphere1 = new Avatar(scene, "Well", "");

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
    ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50, subdivisions: 2 }, scene);
    ground.checkCollisions = true;
    ground.rotate(Axis.Z, 0.5)

}

function createWall() {
    wall = MeshBuilder.CreateBox("wall", { height: 8, width: 2, depth: 0.3 }, scene);
    wall.position = new Vector3(1, 1, 5)
    wall.checkCollisions = true;

    var wallMaterial = new StandardMaterial("wallMat", scene);

    wallMaterial.diffuseColor = new Color3(1, 0, 0);
    wall.material = wallMaterial;

    wall.rotate(Axis.X, 1)
}

function setPhysics(scene: Scene) {
    scene.collisionsEnabled = true;
    scene.beforeRender = () => {
        console.log("intersect ground:", sphere1?.intersectsMesh(ground, false))
        console.log("intersect rampe:", sphere1?.intersectsMesh(wall, false))

        if ((sphere1 != undefined) && (!sphere1?.intersectsMesh(ground, false) && !sphere1?.intersectsMesh(wall, false))) {
            sphere1.gravity = sphere1.default_gravity

        }
        sphere1?.moveWithCollisions(new Vector3(0, sphere1?.gravity, 0))
    }
}