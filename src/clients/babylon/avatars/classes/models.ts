import { AssetContainer, Axis, Color3, InstantiatedEntries, Mesh, MeshBuilder, PointLight, SceneLoader, ShadowGenerator, StandardMaterial, Vector3 } from "babylonjs";
import 'babylonjs-loaders';
import { sendLogin, wsClient } from "../../../connection/connectionClient";
import { loadingRef } from '../../../reactComponents/main';
import { windowExists } from '../../../reactComponents/tools';
import { engine, startRenderLoop } from "../../main";
import { createFire, createFireAnimation } from "../../others/particules";
import { SceneClient } from "../../scene/sceneClient";
import { ALL_CLASSES } from './classesTypes';
import { intrinsicModelProperties, intrinsicModelPropertiesOptional, intrinsicProperties } from './intrinsicProp';

export var shadowGeneratorCampfire: ShadowGenerator;

interface duplicateModel { duplicateModel: () => InstantiatedEntries }

export type intrinsicModelPropertiesD = Readonly<Required<intrinsicModelProperties>> & duplicateModel

export class ModelEnum {
    // The className attribute is used to find the path of the object inside public/model/$className/$className
    static Mage = new ModelEnum("Mage", 1.2, intrinsicProperties.Mage);
    static Warrior = new ModelEnum("Warrior", 1, intrinsicProperties.Warrior);
    static Assassin = new ModelEnum("Rogue", 1, intrinsicProperties.Assassin);
    static Archer = new ModelEnum("Mage", 1, intrinsicProperties.Archer);
    static Healer = new ModelEnum("Mage", 1, intrinsicProperties.Healer);
    static PumpkinMonster = new ModelEnum("PumpkinMonster", 2, intrinsicProperties.PumpkinMonster);


    static Campfire = new ModelEnum("Campfire", 0.25, intrinsicProperties.Campfire);
    static Grass = new ModelEnum("Grass", 0.02, intrinsicProperties.Grass);
    static PineTree = new ModelEnum("PineTree", 1, intrinsicProperties.PineTree);
    static Cactus = new ModelEnum("Cactus", 0.4, intrinsicProperties.Cactus)

    static Ranger = new ModelEnum("Ranger", 1, intrinsicProperties.Ranger);
    static NightMonster = new ModelEnum("NightMonster", 1, intrinsicProperties.NightMonster)

    private readonly className: ALL_CLASSES;
    private readonly extension: string;
    private readonly scaling: number;
    rootMesh: Mesh | undefined
    private container: AssetContainer = new AssetContainer();

    readonly intrinsicParameterMesh: intrinsicModelPropertiesD;

    //Grounds + Water texture + All models + Grass generation
    static totalLoad: number = 0;
    static remainingLoad: number = ModelEnum.totalLoad;



    constructor(className: ALL_CLASSES, scaling: number, p: intrinsicModelPropertiesOptional) {
        this.className = className;
        this.extension = p.fileExtension;
        this.scaling = scaling;
        this.intrinsicParameterMesh = {
            ...p,
            duplicateModel: () => this.duplicate(this.container)
        }
    }

    createModel(scene: SceneClient) {
        SceneLoader.LoadAssetContainer("models/" + this.className + "/", this.className + "." + this.extension, scene, (container) => {
            let meshes = container.meshes as Mesh[]
            let animations = container.animationGroups
            this.container = container;
            this.rootMesh = meshes[0] as Mesh;
            this.rootMesh.scaling = new Vector3(this.scaling, this.scaling, this.scaling);
            this.rootMesh.name = this.className;

            let model;

            ModelEnum.loadingDone();

            switch (this.className) {
                case "Grass":
                    meshes.forEach(m => {
                        if (m.material) {
                            m.material.backFaceCulling = true;
                            m.flipFaces(true);
                        }
                    })
                    meshes.shift();

                    //Merging of all twig of grass in an unique mesh
                    model = Mesh.MergeMeshes(meshes, false);
                    if (model) {
                        this.rootMesh = model;
                        scene.setUpForGrass();
                    }
                    break;

                case "PumpkinMonster":
                    this.rootMesh.position.y -= 0.5;
                    this.rootMesh.rotate(Axis.Y, Math.PI)

                    //left eye
                    let left_eye = MeshBuilder.CreateSphere(this.className + "_left_eye", { segments: 8, diameter: 0.06 }, scene);
                    left_eye.position = new Vector3(0.122, 1.108, 0.125);
                    left_eye.parent = this.rootMesh;

                    var eyeMaterial = new StandardMaterial(this.className + "_material", scene);

                    eyeMaterial.diffuseColor = new Color3(1, 0.5, 0);
                    eyeMaterial.emissiveColor = new Color3(1, 0.5, 0);
                    left_eye.material = eyeMaterial;

                    //right eye
                    let right_eye = left_eye.clone(this.className + "_right_eye");
                    right_eye.position = new Vector3(-0.11, 1.08, 0.15)
                    break;

                case "NightMonster":
                    this.rootMesh.rotate(Axis.Y, Math.PI)
                    this.rootMesh.scaling = new Vector3(2, 2, 2)
                    meshes.forEach(m => {
                        m.isPickable = false;
                        m.checkCollisions = false;
                    });
                    animations[0].stop();
                    break;

                case "Campfire":
                    this.rootMesh.position = new Vector3(5, -0.5, 5);

                    //campfire light
                    let campfireLight = new PointLight(this.className + "_light", this.rootMesh.position.add(new Vector3(0, 0.5, 0.8)), scene);
                    campfireLight.diffuse = new Color3(1, 0.5, 0);
                    campfireLight.specular = new Color3(1, 0.5, 0);
                    campfireLight.range = 15;
                    campfireLight.intensity = 1;
                    campfireLight.parent = this.rootMesh;

                    //campfire shadow (only over the player)
                    shadowGeneratorCampfire = new ShadowGenerator(128, campfireLight);
                    shadowGeneratorCampfire.filteringQuality = ShadowGenerator.QUALITY_LOW;
                    shadowGeneratorCampfire.darkness = 0;

                    //campfire light animation
                    let animFireLight = createFireAnimation();
                    campfireLight.animations.push(animFireLight);
                    scene.beginAnimation(campfireLight, 0, 100, true);

                    //fire effect
                    createFire(this.rootMesh);
                    break;

                case "Mage":
                    this.rootMesh.rotate(Axis.Y, Math.PI);
                    meshes.forEach(m => {
                        m.isPickable = false;
                        m.checkCollisions = false;
                    });
                    break;

                case "Ranger":
                    this.rootMesh.rotate(Axis.Y, Math.PI);
                    this.rootMesh.scaling = new Vector3(1.5, 1.5, 1.5)
                    meshes.forEach(m => {
                        m.isPickable = false;
                        m.checkCollisions = false;
                    });
                    animations[0].stop();
                    break;

                case "Warrior":
                    meshes.forEach(m => {
                        m.isPickable = false;
                        m.checkCollisions = false;
                    });
                    break;

                case "PineTree":
                    scene.setUpForTree();
                    break;

                case "Cactus":
                    scene.setUpForCactus();
                    break;
            }
        })
    }

    duplicate(container: AssetContainer) {
        let entries = container.instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
        return entries;
    }

    static createAllModels(scene: SceneClient) {
        var allModels = [
            this.Mage, this.Warrior, this.Assassin, this.Archer, this.Healer, this.Ranger,
            this.PumpkinMonster, this.NightMonster, this.Grass, this.Campfire, this.PineTree, this.Cactus
        ];
        ModelEnum.addLoadingTask(allModels.length)
        allModels.forEach(m => m.createModel(scene));
    }

    static addLoadingTask(quantity: number) {
        ModelEnum.totalLoad += quantity;
        ModelEnum.remainingLoad += quantity;
    }

    static loadingDone() {
        if (windowExists()) {
            ModelEnum.remainingLoad--;
            loadingRef.current!.updateContent()

            if (ModelEnum.remainingLoad === 0) {
                wsClient.setEventListener()
                sendLogin();
                startRenderLoop(engine);
            }
        }
    }

}