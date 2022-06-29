import { AssetsManager, Axis, DirectionalLight, Engine, GroundMesh, HemisphericLight, Matrix, MeshBuilder, Quaternion, ShadowGenerator, Sprite, SpriteManager, StandardMaterial, Vector3 } from "babylonjs";
import { engine, sphere1, startRenderLoop } from "../main";
import { ModelEnum } from "../others/models";
import { createWall } from "../others/tools";
import { groundParameters, SceneSoft } from "./sceneSoft";
export var light: DirectionalLight;
export var hemiLight: HemisphericLight;
export var shadowGenerator: ShadowGenerator | null;

export class SceneClient extends SceneSoft {
    shadowGenerator: ShadowGenerator | null;
    ground: GroundMesh | undefined;
    grassTaskCounter: number;

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
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        //light = new HemisphericLight("light1", new Vector3(0, 1, 0), this);
        light = new DirectionalLight("light1", new Vector3(-1, -2, -1), this);
        light.position = new Vector3(0, 40, 0);

        // Default intensity is 1.
        light.intensity = 0.7;

        hemiLight = new HemisphericLight("light2", new Vector3(0, 1, 0), this);
        hemiLight.intensity = 0.35;
    }

    createGround() {
        const groundName = "ground1";
        const diffuseTexture = "./textures/aerial_rocks_04_diff_8k.jpg";
        const heightmapTexture = "./textures/aerial_rocks_04_rough_8k.jpg";

        var groundMaterial = new StandardMaterial(groundName + "_material", this);

        var groundTask = this.assetManager!.addTextureTask(groundName + "_diffuse_task", diffuseTexture);

        groundTask.onSuccess = (task) => {
            let groundTexture = task.texture;
            groundTexture.uScale = 5;
            groundTexture.vScale = 5;

            groundTexture.wrapU = 2
            groundTexture.wrapV = 2

            groundMaterial.diffuseTexture = groundTexture;
            groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
        }

        let groundOptions = () => {
            return Object.assign({}, groundParameters, { onReady: () => onGroundCreated() })
        }

        var ground = MeshBuilder.CreateGroundFromHeightMap(
            groundName,
            heightmapTexture,
            {
                ...groundParameters,
                onReady: () => onGroundCreated(),
            },
            this
        );

        let onGroundCreated = () => {
            ground.material = groundMaterial;
            ground.checkCollisions = true;
            ground.receiveShadows = true;
            ground.position.y -= groundParameters.maxHeight;
            this.ground = ground;
            this.setUpForGrass()
        }
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
        var scaling = ModelEnum.Grass.scaling;

        if (model != undefined) {
            var ratio = 1 / scaling;
            model.position = new Vector3(0, 0, 0);
            model.scaling = new Vector3(scaling, scaling, scaling);

            //Creation of 300 herbs at random positions, scaling and orientation
            for (var i = 0; i < 400; i++) {
                let x = Math.random() * 100 * ratio - 50 * ratio;
                let z = Math.random() * 100 * ratio - 50 * ratio;

                if (this.ground?.getHeightAtCoordinates(x, z) != undefined && model) {
                    //Parameters
                    let scaleRatio = (Math.random() + 0.5) * 2
                    let scalingVector = new Vector3(scaleRatio, scaleRatio, scaleRatio);
                    let rotationQuaternion = Quaternion.RotationAxis(Axis.Y, Math.random() * Math.PI);
                    let translationVector = new Vector3(x, (1 * ratio) + this.ground?.getHeightAtCoordinates(x, z) * ratio, z);
                    let scaleRotateTranslateMatrix = Matrix.Compose(scalingVector, rotationQuaternion, translationVector);

                    //Creation of thin instance
                    model.thinInstanceAdd(scaleRotateTranslateMatrix);
                }
            }
        }
    }
};