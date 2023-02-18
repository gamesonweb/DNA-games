import 'babylonjs-loaders';
import { AnimationGroup, AssetContainer, Axis, Color3, InstantiatedEntries, Mesh, MeshBuilder, PointLight, SceneLoader, ShadowGenerator, Skeleton, StandardMaterial, Vector3 } from "babylonjs";
import { engine, scene, startRenderLoop } from "../../main";
import { SceneClient } from "../../scene/sceneClient";
import { createFire, createFireAnimation } from "../../others/particules";
import { sendLogin, wsClient } from "../../../connection/connectionClient";
import { loadingRef } from '../../../reactComponents/main';
import { ALL_CLASSES } from './classesTypes';
import { windowExists } from '../../../reactComponents/tools';
export var shadowGeneratorCampfire: ShadowGenerator;


export type intrinsicModelPropertiesOptional = {
    height?: number;
    width?: number;
    healthYAbove?: number;
    textYAbove?: number;
    className: ALL_CLASSES;
    health: number;
    speed: number;
    weight?: number;
    duplicateModel?: () => InstantiatedEntries;
    speedAttack1?: number;
    speedAttack2?: number;
    speedAttack3?: number;
    speedAttack4?: number;
}

type extensionType = "glb" | "gltf"

export type intrinsicModelProperties = Readonly<Required<intrinsicModelPropertiesOptional>>

export class ModelEnum {
    // The className attribute is used to find the path of the object inside public/model/$className/$className
    static Mage = new ModelEnum("gltf", 1.2, { className: "Mage", health: 90, speed: 0.2, speedAttack1: 1500, speedAttack2: 8000 });
    static Warrior = new ModelEnum("gltf", 1, { className: "Warrior", health: 120, speed: 0.2, speedAttack1: 1500, speedAttack2: 12000 });
    static Assassin = new ModelEnum("gltf", 1, { className: "Rogue", health: 90, speed: 0.25, speedAttack1: 1200, speedAttack2: 10000 });
    static Archer = new ModelEnum("gltf", 1, { className: "Mage", health: 80, speed: 0.25, speedAttack1: 800, speedAttack2: 9000 });
    static Healer = new ModelEnum("gltf", 1, { className: "Mage", health: 100, speed: 0.2, speedAttack1: 1200, speedAttack2: 6000 });
    static Ranger = new ModelEnum("glb", 1, { className: "Ranger", healthYAbove: 2, textYAbove: 2.3, health: 90, speed: 0.2 });

    static PumpkinMonster = new ModelEnum("gltf", 2, { className: "Pumpkin", healthYAbove: 1.4, textYAbove: 1.7, health: 100, speed: 0.2 });

    static Campfire = new ModelEnum("gltf", 0.25, { className: "Campfire", health: 50, speed: 2 });
    static Grass = new ModelEnum("gltf", 0.02, { className: "Grass", health: 50, speed: 2 });
    static Tree = new ModelEnum("gltf", 1, { className: "PineTree", health: 50, speed: 2 });
    // static Terrain = new ModelEnum("terrain", "gltf", 10);

    private readonly className: ALL_CLASSES;
    private readonly extension: extensionType;
    private readonly scaling: number;
    rootMesh: Mesh | undefined
    private container: AssetContainer = new AssetContainer();
    readonly intrinsicParameterMesh: Readonly<Required<intrinsicModelProperties>>;

    //Grounds + Water texture + All models + Grass generation
    static totalLoad: number = 0;
    static remainingLoad: number = ModelEnum.totalLoad;



    constructor(extension: extensionType, scaling: number, p: intrinsicModelPropertiesOptional) {
        this.className = p.className;
        this.extension = extension;
        this.scaling = scaling;
        this.intrinsicParameterMesh = {
            speedAttack1: 1000, speedAttack2: 1000, speedAttack3: 1000, speedAttack4: 1000,
            weight: 1, height: 0.15, width: 1, healthYAbove: 1, textYAbove: 1.3, ...p,
            duplicateModel: () => this.duplicate(this.container)
        }
    }

    createModel(scene: SceneClient) {
        // SceneLoader.ImportMesh("", "models/" + this.name + "/", this.name + "." + this.extension, scene, (loadedMeshes, loadedParticleSystems, loadedSkeletons, loadedAnimationGroups) => {
        //     this.callback(loadedMeshes, loadedSkeletons, loadedAnimationGroups)
        // })
        SceneLoader.LoadAssetContainer("models/" + this.className + "/", this.className + "." + this.extension, scene, (container) => {
            this.callback(container, container.meshes, container.skeletons, container.animationGroups)
        })
    }

    duplicate(container: AssetContainer) {
        let entries = container.instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
        return entries;
    }

    callback(container: AssetContainer, meshes: any[], skeletons: Skeleton[], animations: AnimationGroup[]) {
        this.container = container;
        this.rootMesh = meshes[0] as Mesh;
        this.rootMesh.scaling = new Vector3(this.scaling, this.scaling, this.scaling);
        this.rootMesh.name = this.className;


        let all_meshes = [...meshes];
        let model;

        ModelEnum.loadingDone();

        switch (this.className) {
            case "Grass":
                all_meshes.forEach(m => {
                    if (m.material) {
                        m.material.backFaceCulling = true;
                        m.flipFaces(true);
                        //m.material.transparencyMode = 1;
                    }
                })
                all_meshes.shift();

                //Merging of all twig of grass in an unique mesh
                model = Mesh.MergeMeshes(all_meshes, false);
                if (model) {
                    this.rootMesh = model;
                    scene.setUpForGrass();
                }
                break;

            case "Pumpkin":
                this.rootMesh.position.y -= 0.5;
                this.rootMesh.rotate(Axis.Y, Math.PI)

                //TODO (monster will have cylinder as hitbox like Player currently)
                // meshes.forEach(m => {
                //     m.isPickable = false
                // });

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

            case "Rogue":
                this.rootMesh.rotate(Axis.Y, Math.PI);
                this.rootMesh.scaling = new Vector3(0.8, 0.8, 0.8)
                meshes.forEach(m => {
                    m.isPickable = false;
                    m.checkCollisions = false;
                });
                break;

            case "PineTree":
                scene.setUpForTree();
                break;

            default:
                break;
        }
    }

    static createAllModels(scene: SceneClient) {
        var allModels = [
            this.Mage, this.Warrior, this.Assassin, this.Archer, this.Healer, this.Ranger,
            this.PumpkinMonster, this.Grass, this.Campfire, this.Tree
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