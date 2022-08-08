import { AssetsManager, Axis, BlurPostProcess, DirectionalLight, Engine, HemisphericLight, ImageProcessingPostProcess, Matrix, Mesh, MeshBuilder, Quaternion, SceneLoader, ShadowGenerator, Sprite, SpriteManager, Texture, Vector2, Vector3 } from "babylonjs";
import { WaterMaterial } from "babylonjs-materials";
import { Bullet } from "../avatars/weapons/bullet";
import { engine, scene, sphere1, startRenderLoop } from "../main";
import { ModelEnum } from "../others/models";
import { createWall } from "../others/tools";
import { SceneSoft } from "./sceneSoft";
export var light: DirectionalLight;
export var hemiLight: HemisphericLight;
export var water: Mesh;
export var shadowGenerator: ShadowGenerator | null;
// export var pos_forest: Vector3
export var pos_canyon: Vector3
export var pos_snow: Vector3
// export var pos_lowPo: Vector3
export var pos_volcan: Vector3
export var pos_mossy: Vector3

export class SceneClient extends SceneSoft {
    shadowGenerator: ShadowGenerator | null;
    water: Mesh;
    waterMaterial: WaterMaterial | undefined;
    waterBlurPostProcess: BlurPostProcess | undefined;
    waterBluePostProcess: ImageProcessingPostProcess | undefined;
    grassTaskCounter: number;
    treeTaskCounter: number;
    bulletList: Bullet[];

    constructor(engine: Engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine)
        this.createLight();
        this.water = this.createSea();

        this.shadowGenerator = this.createShadows();
        this.shadowGenerator.addShadowCaster(createWall(this));
        shadowGenerator = this.shadowGenerator;
        // this.createSprites();

        ModelEnum.createAllModels(this);

        this.collisionsEnabled = true;
        this.grassTaskCounter = 0;
        this.treeTaskCounter = 0;




        this.beforeRender = () => {
            if (sphere1) {
                sphere1.isJumping ? sphere1.applyJump() : sphere1.applyGravity();
            }
            if (scene.activeCamera) {
                if (scene.activeCamera.position.y < water.position.y) {
                    if (this.waterBlurPostProcess == undefined) this.waterBlurPostProcess = new BlurPostProcess("Horizontal blur", new Vector2(1.0, 0), 64, 1.0, scene.activeCamera);

                    if (this.waterBluePostProcess == undefined) {
                        this.waterBluePostProcess = new ImageProcessingPostProcess("processing", 1.0, scene.activeCamera);
                        this.waterBluePostProcess.vignetteWeight = 40;
                        this.waterBluePostProcess.vignetteStretch = 1;
                        this.waterBluePostProcess.vignetteColor = new BABYLON.Color4(0, 0, 1, 0);
                        this.waterBluePostProcess.vignetteEnabled = true;
                        console.log("testt")
                    } else {
                        this.waterBluePostProcess.vignetteEnabled = true;
                    }

                } else {
                    if (this.waterBlurPostProcess != undefined) {
                        this.waterBlurPostProcess.dispose();
                        this.waterBlurPostProcess = undefined;
                    }
                    if (this.waterBluePostProcess != undefined) this.waterBluePostProcess.vignetteEnabled = false;
                }
            }
        }

        this.bulletList = []
    }

    /*configureAssetManager() {
        let assetsManager = new AssetsManager(this);
        assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
            engine.loadingUIText = "Loading... " + lastFinishedTask.name + " (" + (totalCount - remainingCount) + "/" + totalCount + ")"
        }

        assetsManager.onFinish = function (tasks) {
            startRenderLoop(engine)
        }

        return assetsManager;
    }*/

    createLight() {
        light = new DirectionalLight("light1", new Vector3(-1, -2, -1), this);
        light.position = new Vector3(0, 40, 0);

        // Default intensity is 1.
        light.intensity = 0.7;

        hemiLight = new HemisphericLight("light2", new Vector3(0, 1, 0), this);
        hemiLight.intensity = 0.35;
    }

    createGround() {
        ModelEnum.addLoadingTask(this.groundsData.length)
        for (const ground of this.groundsData) {
            this.loadGround("models/", ground.modelID, ground.meshName, ground.position)
        }
    }

    loadGround(path: string, modelID: string, meshName: string, position: Vector3, scaling = 100) {
        SceneLoader.Append(path, modelID, this, (scene) => {
            let ground = scene.getMeshByName(meshName) as Mesh;
            ground.scaling = new Vector3(scaling, scaling, scaling)
            ground.checkCollisions = true;
            ground.position = position;
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.grounds!.push(ground.name);

            this.setUpForGrass();
            this.waterMaterial!.addToRenderList(ground);
            ModelEnum.loadingDone();
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

    createSea(): Mesh {
        //water ground
        ModelEnum.addLoadingTask(1);
        this.water = MeshBuilder.CreateGround("waterMesh", { height: 2000, width: 2000, subdivisions: 32 }, this);
        this.water.position.y = -24;
        this.water.isPickable = false;

        this.waterMaterial = new WaterMaterial("waterMaterial", this, new Vector2(256, 256));
        this.waterMaterial.backFaceCulling = false;
        this.waterMaterial.bumpTexture = new Texture("./textures/waterbump.png", this, undefined, undefined, undefined, () => {
            ModelEnum.loadingDone();
        });
        this.waterMaterial.windForce = -5;
        this.waterMaterial.waveHeight = 0.1;
        this.waterMaterial.bumpHeight = 0.1;
        this.waterMaterial.waveLength = 0.1;
        this.waterMaterial.colorBlendFactor = 0;
        this.water.material = this.waterMaterial;

        water = this.water

        return this.water;
    }

    /*createSky() {
        this.clearColor = new Color4(135 / 255, 206 / 255, 235 / 255, 1);
    }*/


    setUpForGrass() {
        //Grounds + Grass
        if (!(++this.grassTaskCounter < this.groundsData.length + 1)) this.grassGeneration()
    }

    setUpForTree() {
        if (!(++this.treeTaskCounter < 1)) this.treeGeneration()
    }

    private grassGeneration() {
        ModelEnum.addLoadingTask(1);
        var model = ModelEnum.Grass.rootMesh;

        if (model != undefined) {
            model.scaling = new Vector3(1, 1, 1);

            //Creation of 400 herbs at random positions, scaling and orientation
            for (let i = 0; i < 2000; i++) {

                let x = Math.random() * 200 - 100;
                let z = Math.random() * 200 - 100;
                let height = this.getHeightAtPoint(x, z);

                if (height != undefined) {
                    this.createThinInstance(model, x, height, z);
                }
            }

            ModelEnum.loadingDone();
        }
    }

    private treeGeneration() {
        ModelEnum.addLoadingTask(1);
        var model = ModelEnum.Tree.rootMesh;

        if (model != undefined) {
            let childs = model.getChildMeshes() as Mesh[];

            let c1 = childs[0];
            let c2 = childs[1];

            let c1m = Mesh.MergeMeshes([c1]);
            let c2m = Mesh.MergeMeshes([c2]);

            for (let i = 0; i < 100; i++) {
                let x = Math.random() * 200 - 100;
                let z = Math.random() * 200 - 100;
                let height = this.getHeightAtPoint(x, z);

                if (height != undefined && model != undefined && c1m && c2m) {
                    let matrix = this.createThinInstance(c1m, x, height, z);
                    this.createThinInstance(c2m, x, height, z, matrix);
                }

            }
            // this.treePositions.forEach(position => {
            //     let x = position.x;
            //     let z = position.z;
            //     let height = this.getHeightAtPoint(x, z);

            //     if (height != undefined && model != undefined && c1m && c2m) {
            //         let matrix = this.createThinInstance(c1m, x, height, z);
            //         this.createThinInstance(c2m, x, height, z, matrix);
            //     }
            // });

            ModelEnum.loadingDone();
        }

    }

    private createThinInstance(model: Mesh, x: number, height: number, z: number, transformMatrix?: Matrix): Matrix {
        if (transformMatrix != undefined) {
            model.thinInstanceAdd(transformMatrix);
            return transformMatrix;
        }

        //Parameters
        let scaleRatio = 3 - Math.random() * 2.5
        let scalingVector = new Vector3(scaleRatio, scaleRatio, scaleRatio);
        let rotationQuaternion = Quaternion.RotationAxis(Axis.Y, Math.random() * Math.PI);
        let translationVector = new Vector3(x, height - 0.2, z);
        let scaleRotateTranslateMatrix = Matrix.Compose(scalingVector, rotationQuaternion, translationVector);

        //Creation of thin instance
        model.thinInstanceAdd(scaleRotateTranslateMatrix);
        return scaleRotateTranslateMatrix;
    }
}
