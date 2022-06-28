import { AnimationGroup, IParticleSystem, Mesh, Skeleton, Vector3 } from "babylonjs";
import { scene } from "./main";
import { MySceneClient } from "./scene/scene";

import 'babylonjs-loaders';

export class ModelEnum {
    static PumpkinMonster = new ModelEnum("pumpkin_monster", "gltf", 2);
    static Grass = new ModelEnum("grass", "gltf", 0.02)

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

    createModel(scene: MySceneClient) {
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
                myMeshes.forEach(m => {
                    if (m.material) {
                        m.material.backFaceCulling = true;
                        m.flipFaces(true);
                        //m.material.transparencyMode = 1;
                    }
                })
                myMeshes.shift();
                //Merging of all twig of grass in an unique mesh
                let model = Mesh.MergeMeshes(myMeshes);
                if (model) {
                    this.rootMesh = model;
                    scene.setUpForGrass();
                }
                break;

            default:
                meshes[0].scaling = new Vector3(this.scaling, this.scaling, this.scaling);
                this.rootMesh = meshes[0];
                break;
        }



    }

    static createAllModels(scene: MySceneClient) {
        var allModels = [this.PumpkinMonster, this.Grass]
        allModels.forEach(m => m.createModel(scene))
    }
}