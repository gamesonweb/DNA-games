import { AssetsManager, Axis, DirectionalLight, Engine, HemisphericLight, Matrix, Mesh, Quaternion, Ray, SceneLoader, ShadowGenerator, Sprite, SpriteManager, Vector3 } from "babylonjs";
import { engine, sphere1, startRenderLoop } from "../main";
import { ModelEnum } from "../others/models";
import { createWall } from "../others/tools";
import { SceneSoft } from "./sceneSoft";
export var light: DirectionalLight;
export var hemiLight: HemisphericLight;
export var shadowGenerator: ShadowGenerator | null;

export class SceneClient extends SceneSoft {
    shadowGenerator: ShadowGenerator | null;
    ground: Mesh | undefined;
    grassTaskCounter: number;
    heightRay: Ray;

    constructor(engine: Engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine)
        this.createLight();

        this.shadowGenerator = this.createShadows();
        this.shadowGenerator.addShadowCaster(createWall(this));
        shadowGenerator = this.shadowGenerator;
        // this.createSprites();

        ModelEnum.createAllModels(this);

        this.collisionsEnabled = true;
        this.grassTaskCounter = 0;

        this.heightRay = new Ray(new Vector3(0, 0, 0), new Vector3(0, -1, 0), 30);

        this.beforeRender = () => {
            if (sphere1) {
                sphere1.isJumping ? sphere1.applyJump() : sphere1.applyGravity();
            }
        }
    }

    configureAssetManager() {
        let assetsManager = new AssetsManager(this);
        assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
            engine.loadingUIText = "Loading... " + lastFinishedTask.name + " (" + (totalCount - remainingCount) + "/" + totalCount + ")"
        }

        assetsManager.onFinish = function (tasks) {
            startRenderLoop(engine)
        }

        return assetsManager;
    }

    createLight() {
        light = new DirectionalLight("light1", new Vector3(-1, -2, -1), this);
        light.position = new Vector3(0, 40, 0);

        // Default intensity is 1.
        light.intensity = 0.7;

        hemiLight = new HemisphericLight("light2", new Vector3(0, 1, 0), this);
        hemiLight.intensity = 0.35;
    }

    createGround() {
        SceneLoader.Append("models/", "antTextureBaked.babylon", this, (scene) => {
            // let ground = scene.getMeshByName("Object_2") as Mesh;
            let ground = scene.getMeshByName("Landscape") as Mesh;
            // let ground = scene.getMeshByName("Landscape.001") as Mesh;
            ground.scaling = new Vector3(100, 100, 100)
            ground.checkCollisions = true;
            ground.position.z -= 8
            ground.position.y -= 20
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.ground = ground;

            this.setUpForGrass();
        });
    }

    createSprites() {
        var spriteManagerTrees = new SpriteManager("grassesManager", "./textures/herb.png", 2000, 800, this);

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

    createShadows(): ShadowGenerator {
        let shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW;
        shadowGenerator.darkness = 0.2;

        //Makes the shadow blurred (but shadow disappear if above a mesh)
        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.useKernelBlur = true;
        // shadowGenerator.blurKernel = 4;
        // shadowGenerator.blurScale = 1;

        //Transparent mesh
        // shadowGenerator.transparencyShadow = true;
        // shadowGenerator.enableSoftTransparentShadow = true;
        return shadowGenerator
    }

    /*createSky() {
        this.clearColor = new Color4(135 / 255, 206 / 255, 235 / 255, 1);
    }*/


    setUpForGrass() {
        if (!(++this.grassTaskCounter < 2)) this.grassGeneration()
    }

    private grassGeneration() {
        var model = ModelEnum.Grass.rootMesh;

        if (model != undefined) {
            model.scaling = new Vector3(1, 1, 1);

            //Creation of 400 herbs at random positions, scaling and orientation
            for (var i = 0; i < 400; i++) {

                let x = Math.random() * 100 - 50;
                let z = Math.random() * 100 - 50;
                let height = this.getHeightAtPoint(x, z)

                if (height != undefined) {
                    //Parameters
                    let scaleRatio = 3 - Math.random() * 2.5
                    let scalingVector = new Vector3(scaleRatio, scaleRatio, scaleRatio);
                    let rotationQuaternion = Quaternion.RotationAxis(Axis.Y, Math.random() * Math.PI);
                    let translationVector = new Vector3(x, height - 0.2, z);
                    let scaleRotateTranslateMatrix = Matrix.Compose(scalingVector, rotationQuaternion, translationVector);

                    //Creation of thin instance
                    model.thinInstanceAdd(scaleRotateTranslateMatrix);
                }
            }
        }
    }

    getHeightAtPoint(x: number, z: number): number | undefined {
        this.heightRay.origin = new Vector3(x, 20, z)

        var hits = this.multiPickWithRay(this.heightRay, (m) => { return m.isPickable });
        var filtered = hits?.filter(e => e.pickedMesh?.name === this.ground!.name)


        if (filtered !== undefined && filtered.length > 0) {
            var hit = filtered[0]
            if (hit !== null && hit.pickedPoint) {
                return hit.pickedPoint.y
            }
        }
        return undefined;
    }
};
