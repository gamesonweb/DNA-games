import { AnimationGroup, Axis, Color3, IParticleSystem, Mesh, MeshBuilder, PointLight, ShadowGenerator, Skeleton, StandardMaterial, Vector3 } from "babylonjs";
import { scene, sphere1 } from "../main";
import { SceneClient } from "../scene/sceneClient";

import 'babylonjs-loaders';
import { createFire, createFireAnimation } from "./particules";
export var shadowGeneratorCampfire: ShadowGenerator;
export class ModelEnum {
    static PumpkinMonster = new ModelEnum("pumpkin_monster", "gltf", 2);
    static Grass = new ModelEnum("grass", "gltf", 0.02);
    static Campfire = new ModelEnum("campfire", "gltf", 0.25);
    // static Terrain = new ModelEnum("terrain", "gltf", 10);

    name: string;
    extension: string;
    scaling: number;
    rootMesh: Mesh | undefined
    particules: IParticleSystem[] = [];
    skeletons: Skeleton[] = [];



    constructor(name: string, extension: string, scaling: number) {
        this.name = name;
        this.extension = extension;
        this.scaling = scaling;
    }

    createModel(scene: SceneClient) {
        // console.log(scene.assetManager);

        //A priori, all gltf extension file will be (automatically) named "scene", else the same name of the respective folder
        if (scene.assetManager) {
            let meshTask = scene.assetManager.addMeshTask(this.name + "_task", "", "models/" + this.name + "/", (this.extension == "gltf" ? "scene" : this.name) + "." + this.extension);
            meshTask.onSuccess = (task) => {
                this.callback(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons, task.loadedAnimationGroups)
            }
        } else {
            throw new Error("No asset menager in scene !")
        }

    }

    callback(meshes: any[], particules: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[]) {
        this.rootMesh = meshes[0] as Mesh;
        this.rootMesh.scaling = new Vector3(this.scaling, this.scaling, this.scaling);
        this.rootMesh.name = this.name;

        switch (this.name) {
            case "grass":
                let all_meshes = [...meshes];
                all_meshes.forEach(m => {
                    if (m.material) {
                        m.material.backFaceCulling = true;
                        m.flipFaces(true);
                        //m.material.transparencyMode = 1;
                    }
                })
                all_meshes.shift();

                //Merging of all twig of grass in an unique mesh
                let model = Mesh.MergeMeshes(all_meshes);
                if (model) {
                    this.rootMesh = model;
                    scene.setUpForGrass();
                }
                break;

            case "pumpkin_monster":
                this.rootMesh.position.y -= 0.5;
                this.rootMesh.rotate(Axis.Y, Math.PI)

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
                shadowGeneratorCampfire.addShadowCaster(sphere1!.shape);

                //campfire light animation
                let animFireLight = createFireAnimation();
                campfireLight.animations.push(animFireLight);
                scene.beginAnimation(campfireLight, 0, 100, true);

                //fire effect
                createFire(this.rootMesh);
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
        var allModels = [this.PumpkinMonster, this.Grass, this.Campfire];
        allModels.forEach(m => m.createModel(scene));
    }
}