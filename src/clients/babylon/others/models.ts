import { AnimationGroup, Axis, Color3, IParticleSystem, Mesh, MeshBuilder, PointLight, SceneLoader, ShadowGenerator, Skeleton, StandardMaterial, Vector3 } from "babylonjs";
import { engine, scene, startRenderLoop } from "../main";
import { SceneClient } from "../scene/sceneClient";

import 'babylonjs-loaders';
import { createFire, createFireAnimation } from "./particules";
import { unmountComponentAtNode } from "react-dom";
import { loadingRef } from "../../reactComponents/loadingScreen";
import { sendLogin, wsClient } from "../../connection/connectionClient";
export var shadowGeneratorCampfire: ShadowGenerator;

export class ModelEnum {
    static PumpkinMonster = new ModelEnum("pumpkin_monster", "gltf", 2);
    static Campfire = new ModelEnum("campfire", "gltf", 0.25);
    static Mage = new ModelEnum("mage", "gltf", 1.2);
    static Warrior = new ModelEnum("warrior", "gltf", 1);
    static Assassin = new ModelEnum("Rogue", "gltf", 1);

    static Grass = new ModelEnum("grass", "gltf", 0.02);
    static Tree = new ModelEnum("pine_tree", "gltf", 1)
    // static Terrain = new ModelEnum("terrain", "gltf", 10);

    name: string;
    extension: string;
    scaling: number;
    rootMesh: Mesh | undefined
    particules: IParticleSystem[] = [];
    skeletons: Skeleton[] = [];

    //Grounds + Water texture + All models + Grass generation
    static totalLoad: number = 0;
    static remainingLoad: number = ModelEnum.totalLoad;



    constructor(name: string, extension: string, scaling: number) {
        this.name = name;
        this.extension = extension;
        this.scaling = scaling;
    }

    createModel(scene: SceneClient) {
        // console.log(scene.assetManager);

        //A priori, all gltf extension file will be (automatically) named "scene", else the same name of the respective folder
        // if (scene.assetManager) {
        //     let meshTask = scene.assetManager.addMeshTask(this.name + "_task", "", "models/" + this.name + "/", (this.extension == "gltf" ? "scene" : this.name) + "." + this.extension);
        //     meshTask.onSuccess = (task) => {
        //         this.callback(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons, task.loadedAnimationGroups)
        //     }
        // } else {
        //     throw new Error("No asset menager in scene !")
        // }

        SceneLoader.ImportMesh("", "models/" + this.name + "/", this.name + "." + this.extension, scene, (loadedMeshes, loadedParticleSystems, loadedSkeletons, loadedAnimationGroups) => {
            this.callback(loadedMeshes, loadedParticleSystems, loadedSkeletons, loadedAnimationGroups)
        })

    }

    callback(meshes: any[], particules: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[]) {
        this.rootMesh = meshes[0] as Mesh;
        this.rootMesh.scaling = new Vector3(this.scaling, this.scaling, this.scaling);
        this.rootMesh.name = this.name;


        let all_meshes = [...meshes];
        let model;

        ModelEnum.loadingDone();

        switch (this.name) {
            case "grass":
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

            case "pumpkin_monster":
                this.rootMesh.position.y -= 0.5;
                this.rootMesh.rotate(Axis.Y, Math.PI)

                //TODO (monster will have cylinder as hitbox like Player currently)
                // meshes.forEach(m => {
                //     m.isPickable = false
                // });

                //left eye
                let left_eye = MeshBuilder.CreateSphere(this.name + "_left_eye", { segments: 8, diameter: 0.06 }, scene);
                left_eye.position = new Vector3(0.122, 1.108, 0.125);
                left_eye.parent = this.rootMesh;

                var eyeMaterial = new StandardMaterial(this.name + "_material", scene);

                eyeMaterial.diffuseColor = new Color3(1, 0.5, 0);
                eyeMaterial.emissiveColor = new Color3(1, 0.5, 0);
                left_eye.material = eyeMaterial;

                //right eye
                let right_eye = left_eye.clone(this.name + "_right_eye");
                right_eye.position = new Vector3(-0.11, 1.08, 0.15)
                break;

            case "campfire":
                this.rootMesh.position = new Vector3(5, -0.5, 5);

                //campfire light
                let campfireLight = new PointLight(this.name + "_light", this.rootMesh.position.add(new Vector3(0, 0.5, 0.8)), scene);
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

            case "mage":
                this.rootMesh.rotate(Axis.Y, Math.PI);
                meshes.forEach(m => {
                    m.isPickable = false;
                    m.checkCollisions = false;
                });
                break;

            case "warrior":
                meshes.forEach(m => {
                    m.isPickable = false;
                    m.checkCollisions = false;
                });
                break;
            case "pine_tree":
                // all_meshes.shift();

                //Merging of all twig of grass in an unique mesh
                // console.log(all_meshes);

                //Need to separate because of bug of disaparition when merged with MultiMaterial
                // model = Mesh.MergeMeshes(all_meshes, undefined, undefined, undefined, undefined, true);


                // if (model) {
                //     this.rootMesh = model;

                // }
                scene.setUpForTree();
                break;


            // case "terrain":
            //     this.rootMesh = meshes[0] as Mesh;
            //     meshes[0].position = new Vector3(0, -5, 0);
            //     meshes[0].checkCollisions = true;
            //     meshes[0].collisionsEnabled = true;
            //     this.rootMesh.showBoundingBox = true;

            //     this.rootMesh.bakeCurrentTransformIntoVertices();


            //     var myGround = MeshBuilder.CreateGround("myGround", { width: 100, height: 100, subdivisions: 64 }, scene);
            //     // myGround.rotate(Axis.Z, Math.PI / 3)


            //     let data = VertexData.ExtractFromMesh(this.rootMesh);
            //     console.log(data);


            //     data.applyToMesh(myGround);
            //     myGround.flipFaces();

            //     myGround.scaling = new Vector3(10, 10, 10)
            //     myGround.checkCollisions = true
            //     break;

            default:
                break;
        }
    }

    static createAllModels(scene: SceneClient) {
        var allModels = [this.PumpkinMonster, this.Grass, this.Campfire, this.Mage, this.Warrior, this.Assassin, this.Tree];
        ModelEnum.addLoadingTask(allModels.length)
        allModels.forEach(m => m.createModel(scene));
    }

    static addLoadingTask(quantity: number) {
        ModelEnum.totalLoad += quantity;
        ModelEnum.remainingLoad += quantity;
    }

    static loadingDone() {
        ModelEnum.remainingLoad--;
        let doneLoad = ModelEnum.totalLoad - ModelEnum.remainingLoad;
        let stat = Math.round(doneLoad / ModelEnum.totalLoad * 100 * 100) / 100 + "%";
        loadingRef.current!.setContent("Loading... " + stat)

        if (ModelEnum.remainingLoad === 0) {
            wsClient.setEventListener()
            sendLogin();
            unmountComponentAtNode(document.getElementById('root')!);
            startRenderLoop(engine);

        }
    }

}