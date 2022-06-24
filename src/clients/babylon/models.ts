import { AbstractMesh, IParticleSystem, SceneLoader, Skeleton, Vector3 } from "babylonjs";
import { scene } from "./main";
import { MyScene } from "./scene";

import 'babylonjs-loaders';

export class ModelEnum {
    static Warrior = new ModelEnum("warrior");

    name: string;
    meshes: AbstractMesh[] = [];
    particules: IParticleSystem[] = [];
    skeletons: Skeleton[] = [];


    constructor(name: string) {
        this.name = name;
    }

    createModel(scene: MyScene) {
        // SceneLoader.ImportMesh(this.name, "./models/" + this.name + "/", "barrel" + ".obj", scene, (meshes, particles, skeletons) => {
        //     this.callback(meshes, particles, skeletons)
        // })

        let meshTask = scene.assetManager.addMeshTask(this.name + "_task", this.name, "./models/" + this.name + "/", "barrel" + ".obj");
        meshTask.onSuccess = (task) => {
            console.log(task)
            this.callback(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons)
        }

    }

    callback(meshes: AbstractMesh[], particules: IParticleSystem[], skeletons: Skeleton[]) {
        console.log(meshes)
        let model = meshes[0];
        model.position = new Vector3(5, 5, 2);
    }

    static createAllModels(scene: MyScene) {
        var allModels = [this.Warrior]
        allModels.forEach(m => m.createModel(scene))
    }
}