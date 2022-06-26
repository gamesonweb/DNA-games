import { AbstractMesh, AnimationGroup, Axis, Color3, IParticleSystem, Matrix, Mesh, Quaternion, SceneLoader, Skeleton, Vector3 } from "babylonjs";
import { scene } from "./main";
import { MyScene } from "./scene";

import 'babylonjs-loaders';

export class ModelEnum {
    // static Warrior = new ModelEnum("warrior");
    static Grass = new ModelEnum("grass", "gltf", 0.02)

    name: string;
    extension: string;
    scaling: number;
    mesh: Mesh | undefined
    particules: IParticleSystem[] = [];
    skeletons: Skeleton[] = [];



    constructor(name: string, extension: string, scaling: number) {
        this.name = name;
        this.extension = extension;
        this.scaling = scaling;
    }

    createModel(scene: MyScene) {
        //A priori, all gltf extension file will be (automatically) named "scene", else the same name of the respective folder
        let meshTask = scene.assetManager.addMeshTask(this.name + "_task", "", "models/" + this.name + "/", (this.extension == "gltf" ? "scene" : this.name) + "." + this.extension);
        meshTask.onSuccess = (task) => {
            this.callback(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons, task.loadedAnimationGroups)
        }

    }

    callback(meshes: any[], particules: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[]) {
        switch (this.name) {
            case "grass":
                let myMeshes = [...meshes];
                myMeshes.shift();
                //Merging of all twig of grass in an unique mesh
                let model = Mesh.MergeMeshes(myMeshes);
                if (model) {
                    this.mesh = model;
                    scene.setUpForGrass();
                }
                break;

            default:
                break;
        }



    }

    static createAllModels(scene: MyScene) {
        var allModels = [this.Grass]
        allModels.forEach(m => m.createModel(scene))
    }
}