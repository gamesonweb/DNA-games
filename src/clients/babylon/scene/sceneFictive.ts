import { Engine, Mesh, SceneLoader, Vector3 } from "babylonjs";
import 'babylonjs-loaders';
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
    }

    createGround() {
        // const groundName = "ground1";
        // const heightmapTexture = "http://localhost:3000/textures/aerial_rocks_04_rough_8k.jpg";

        // let ground: GroundMesh;

        // ground = MeshBuilder.CreateGround(
        //     groundName,
        //     {
        //         ...groundParameters
        //     },
        // )
        // ground.checkCollisions = true;
        // let scene = this;

        // ground = MeshBuilder.CreateGroundFromHeightMap(
        //     groundName,
        //     heightmapTexture,
        //     {
        //         ...groundParameters,
        //         onReady: function (ground: GroundMesh) {
        //             ground.position.y -= groundParameters.maxHeight;
        //             ground.checkCollisions = true;
        //             scene.ground = ground;
        //             console.log("Ground is READY");
        //             ground.isPickable = true
        //         },

        //     },
        //     this
        // );

        // in future replace with : http://127.0.0.1:3000/models/
        // SceneLoader.Append("https://raw.githubusercontent.com/proace137/assets/master/", "testmap.glb", scene, function (scene) {
        // SceneLoader.Append("http://127.0.0.1:3000/models/terrain/", "scene.gltf", scene, function (scene) {
        //     let mesh = scene.getMeshByName("Plane") as Mesh;
        //     mesh.isPickable = true;
        //     mesh.scaling = new Vector3(20, 20, 20)

        //     mesh.bakeCurrentTransformIntoVertices();


        //     var myGround = MeshBuilder.CreateGround("myGround", { width: 1000, height: 1000, subdivisions: 8 }, scene);
        //     myGround.position.x -= 5

        //     let data = VertexData.ExtractFromMesh(mesh);

        //     data.applyToMesh(myGround);
        //     myGround.flipFaces();

        //     mesh.setEnabled(false);
        //     ws.night_monster_list.set("Tester", new AvatarFictive(scene, "Tester"));
        // });

        // SceneLoader.Append("http://127.0.0.1:3000/models/", "antTextureBaked.babylon", scene, function (newMeshes) {
        //     // let mesh = newMeshes.getMeshByName("Object_2") as Mesh;
        //     let mesh = scene.getMeshByName("Landscape") as Mesh;
        //     mesh.scaling = new Vector3(100, 100, 100)
        //     mesh.checkCollisions = true;
        //     mesh.isPickable = true;
        //     mesh.position.z -= 8
        //     mesh.position.y -= 20
        //     mesh.freezeWorldMatrix()
        // }
        // );

        // SceneLoader.Append("http://127.0.0.1:3000/models/", "colorRampBaked.babylon", scene, function (newMeshes) {
        //     // let mesh = newMeshes.getMeshByName("Object_2") as Mesh;
        //     let mesh = scene.getMeshByName("Landscape") as Mesh;
        //     mesh.scaling = new Vector3(100, 100, 100)
        //     mesh.checkCollisions = true;
        //     mesh.isPickable = true;
        //     mesh.position.z += 200
        //     mesh.position.y -= 20
        //     mesh.freezeWorldMatrix()
        // }
        // );

        for (const ground of this.groundsData) {
            this.loadGround("http://127.0.0.1:3000/models/", ground.modelID, ground.meshName, ground.position)
        }
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