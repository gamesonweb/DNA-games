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
    meshes: AbstractMesh[] = [];
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
        if (this.name == "grass") {
            let myMeshes = [...meshes]
            myMeshes.shift()
            //Merging of all twig of grass in an unique mesh
            let model = Mesh.MergeMeshes(myMeshes)
            if (model) {
                if (model.material && model.material.backFaceCulling) model.material.backFaceCulling = true;
                var ratio = 1 / this.scaling;
                model.position = new Vector3(0, 0, 0);
                model.scaling = new Vector3(this.scaling, this.scaling, this.scaling);

                //Creation of 300 herbs at random positions, scaling and orientation
                for (var i = 0; i < 300; i++) {
                    let x = Math.random() * 100 * ratio - 50 * ratio;
                    let z = Math.random() * 100 * ratio - 50 * ratio;

                    if (scene.ground?.getHeightAtCoordinates(x, z) != undefined && model) {
                        //Parameters
                        let scaleRatio = (Math.random() + 0.5) * 2
                        let scalingVector = new Vector3(scaleRatio, scaleRatio, scaleRatio);
                        let rotationQuaternion = Quaternion.RotationAxis(Axis.Y, Math.random() * Math.PI);
                        let translationVector = new Vector3(x, (1 * ratio) + scene.ground?.getHeightAtCoordinates(x, z) * ratio, z);
                        let scaleRotateTranslateMatrix = Matrix.Compose(scalingVector, rotationQuaternion, translationVector);

                        //Creation of thin instance
                        model.thinInstanceAdd(scaleRotateTranslateMatrix);
                    }
                }
            }
        }


    }

    static createAllModels(scene: MyScene) {
        var allModels = [this.Grass]
        allModels.forEach(m => m.createModel(scene))
    }
}