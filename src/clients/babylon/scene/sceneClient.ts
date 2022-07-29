import { AssetsManager, Axis, DirectionalLight, Engine, HemisphericLight, Matrix, Mesh, MeshBuilder, Quaternion, Ray, SceneLoader, ShadowGenerator, Sprite, SpriteManager, Texture, Vector2, Vector3 } from "babylonjs";
import { WaterMaterial } from "babylonjs-materials";
import { engine, sphere1, startRenderLoop } from "../main";
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
    grassTaskCounter: number;

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
        var offset = -20
        //load canyon
        pos_canyon = new Vector3(0, offset, 0)
        SceneLoader.Append("models/", "Desert.babylon", this, (scene) => {
            let ground = scene.getMeshByName("Desert") as Mesh;
            ground.scaling = new Vector3(100, 100, 100)
            ground.checkCollisions = true;
            ground.position = pos_canyon;
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.grounds!.push(ground.name);

            this.setUpForGrass();
            this.waterMaterial!.addToRenderList(ground);
            //TODO Correctly
            setTimeout(() => { this.waterMaterial!.addToRenderList(sphere1!.shape) }, 2000)
        });

        //load mossy
        pos_mossy = new Vector3(400, offset, 100)
        SceneLoader.Append("models/", "mossy.babylon", this, (scene) => {
            let ground = scene.getMeshByName("Mossy") as Mesh;
            ground.scaling = new Vector3(100, 100, 100)
            ground.checkCollisions = true;
            ground.position = pos_mossy;
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.grounds!.push(ground.name);
            this.waterMaterial!.addToRenderList(ground);
        });

        //load snow mountain
        pos_snow = new Vector3(400, offset, 280)
        SceneLoader.Append("models/", "snowMountain.babylon", this, (scene) => {
            let ground = scene.getMeshByName("Snow") as Mesh;
            ground.scaling = new Vector3(100, 100, 100)
            ground.checkCollisions = true;
            ground.position = pos_snow;
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.grounds!.push(ground.name);
            this.waterMaterial!.addToRenderList(ground);
        });

        //load volcan
        pos_volcan = new Vector3(-100, offset, 500)
        SceneLoader.Append("models/", "volcan.babylon", this, (scene) => {
            let ground = scene.getMeshByName("Volcan") as Mesh;
            ground.scaling = new Vector3(100, 100, 100)
            ground.checkCollisions = true;
            ground.position = pos_volcan
            ground.freezeWorldMatrix();
            ground.receiveShadows = true;
            ground.isPickable = true;
            this.grounds!.push(ground.name);
            this.waterMaterial!.addToRenderList(ground);
            this.setUpForGrass();
        });

        //load forest
        // pos_forest = new Vector3(0, offset, 200)
        // SceneLoader.Append("models/", "colorRampBaked.babylon", this, (scene) => {
        //     let ground = scene.getMeshByName("Landscape") as Mesh;
        //     ground.scaling = new Vector3(100, 100, 100)
        //     ground.checkCollisions = true;
        //     ground.position = pos_forest;
        //     ground.freezeWorldMatrix();
        //     ground.receiveShadows = true;
        //     ground.isPickable = true;
        //     this.grounds!.push(ground.name);
        // });

        //load low Poly terrain
        // pos_lowPo = new Vector3(-200, offset, 0)
        // SceneLoader.Append("models/", "lowPoBasic.babylon", this, (scene) => {
        //     let ground = scene.getMeshByName("LowPoBasic") as Mesh;
        //     ground.scaling = new Vector3(100, 100, 100)
        //     ground.checkCollisions = true;
        //     ground.position = pos_lowPo;
        //     ground.freezeWorldMatrix();
        //     ground.receiveShadows = true;
        //     ground.isPickable = true;
        //     this.grounds!.push(ground.name);
        // });
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
        this.water = MeshBuilder.CreateGround("waterMesh", { height: 2000, width: 2000, subdivisions: 32 }, this);
        this.water.position.y = -24;
        this.water.isPickable = false;

        this.waterMaterial = new WaterMaterial("waterMaterial", this, new Vector2(256, 256));
        this.waterMaterial.backFaceCulling = true;
        this.waterMaterial.bumpTexture = new Texture("./textures/waterbump.png", this);
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
        if (!(++this.grassTaskCounter < 3)) this.grassGeneration()
    }

    private grassGeneration() {
        var model = ModelEnum.Grass.rootMesh;

        if (model != undefined) {
            model.scaling = new Vector3(1, 1, 1);

            //Creation of 400 herbs at random positions, scaling and orientation
            for (var i = 0; i < 2000; i++) {

                let x = Math.random() * 200 - 100;
                let z = Math.random() * 200 - 100;
                let height = this.getHeightAtPoint(x, z)

                if (height != undefined && height <= -15) {
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
};
