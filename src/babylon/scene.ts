import { FreeCamera, HemisphericLight, MeshBuilder, Scene, Sprite, SpriteManager, StandardMaterial, Texture, Vector3 } from "babylonjs";
import { canvas, engine, jumpRay, ray, scene, sphere1 } from "./main";
import { createWall } from "./tools";
export var light: HemisphericLight;
export var gravity: number;

export function createScene() {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new Scene(engine!);

    window.scene = scene;

    createCamera()
    createLight()
    createGround()
    createWall()

    createSprites()

    // sphere1 = new Avatar(scene, "Well", "");
    gravity = -0.02;
    scene.collisionsEnabled = true;

    scene.beforeRender = () => {

        sphere1?.isJumping ? applyJump() : applyGravity()
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
    const groundMaterial = new StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new Texture("./img/grass.png");
    ground.material = groundMaterial;
    ground.checkCollisions = true;
    //ground.rotate(Axis.Z, 0.5)

}

function createSprites() {
    var spriteManagerTrees = new SpriteManager("grassesManager", "./img/herb.png", 2000, 800, scene);

    //Creation of 2000 trees at random positions
    for (var i = 0; i < 2000; i++) {
        let herb = new Sprite("herb", spriteManagerTrees);
        herb.height = Math.random() * 2
        herb.width = Math.random() * 2
        herb.position.x = Math.random() * 50 - 25;
        herb.position.z = Math.random() * 50 - 25;
        herb.position.y = 0.5;
    }
}

function applyGravity() {
    //sphere1?.moveWithCollisions(new Vector3(0, -0.5, 0))
    if (sphere1) {
        var hits = scene.multiPickWithRay(ray, (m) => { return m.isPickable });

        var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

        if (filtered !== undefined && filtered.length > 0) {
            var hit = filtered[0]
            if (hit !== null && hit.pickedPoint && sphere1.position.y > hit.pickedPoint.y + 1.2) {
                sphere1.position.y += gravity
            }
        } else {
            sphere1.position.y += gravity * 4
        }
    }
}

function applyJump() {
    if (sphere1) {
        var hits = scene.multiPickWithRay(jumpRay, (m) => { return m.isPickable });

        var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

        if (filtered !== undefined && filtered.length > 0) {
            var hit = filtered[0]
            if (hit !== null && hit.pickedPoint && sphere1.position.y < hit.pickedPoint.y - 1.2) {
                sphere1.position.y -= gravity
            }
        } else {
            sphere1.position.y -= gravity * 6
        }
    }
}