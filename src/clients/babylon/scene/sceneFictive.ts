import { Engine, Mesh, MeshBuilder, SceneLoader, Vector3 } from "babylonjs";
import { scene } from "../main";
import { SceneSoft } from "./sceneSoft";

export class SceneFictive extends SceneSoft {
    gravityIntensity: number;
    grassTaskCounter: number;

    constructor(engine: Engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine)

        this.gravityIntensity = -0.02;
        this.collisionsEnabled = true;
        this.grassTaskCounter = 0;
        this.treeGeneration();
    }

    createGround() {
        this.createWaterGround()

        for (const ground of this.groundsData) {
            this.loadGround("http://127.0.0.1:3000/models/", ground.modelID, ground.meshName, ground.position)
        }
    }

    treeGeneration() {
        this.treePositions.forEach((positionData) => {
            let x = positionData.x
            let z = positionData.z
            let height = this.getHeightAtPoint(x, z);
            if (height) {
                var collider = MeshBuilder.CreateCylinder("arbre", { height: 4, diameter: 0.6 }, scene)
                collider.position = new Vector3(x, height + 1.2, z)
                collider.checkCollisions = true
            }
        })
    }

    loadGround(path: string, modelID: string, meshName: string, position: Vector3, scaling = 100) {
        SceneLoader.Append(path, modelID, this, (scene) => {
            let ground = scene.getMeshByName(meshName) as Mesh;
            ground.scaling = new Vector3(scaling, scaling, scaling)
            ground.checkCollisions = true;
            ground.position = position;
            ground.freezeWorldMatrix();
            ground.isPickable = true;
            this.grounds!.push(ground.name);
        });
    }
};