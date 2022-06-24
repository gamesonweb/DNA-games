import { AbstractMesh, AnimationGroup, IParticleSystem, SceneLoader, Skeleton, Vector3 } from "babylonjs";
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

        let meshTask = scene.assetManager.addMeshTask(this.name + "_task", "", "models/" + this.name + "/", "barrel" + ".obj");
        meshTask.onSuccess = (task) => {
            this.callback(task.loadedMeshes, task.loadedParticleSystems, task.loadedSkeletons, task.loadedAnimationGroups)
        }

    }

    callback(meshes: AbstractMesh[], particules: IParticleSystem[], skeletons: Skeleton[], animations: AnimationGroup[]) {
        let model = meshes[0];
        model.position = new Vector3(5, 1, 2);
    }

    static createAllModels(scene: MyScene) {
        var allModels = [this.Warrior]
        allModels.forEach(m => m.createModel(scene))
    }
}