import { Engine, GroundMesh, Mesh, MeshBuilder, SceneLoader, Vector3, VertexData } from "babylonjs";
import 'babylonjs-loaders';
import { ws } from "../../connection/connectionFictive";
import { AvatarFictive } from "../avatars/avatarFictif";
import { groundParameters, SceneSoft } from "./sceneSoft";

export class SceneFictive extends SceneSoft {
    gravityIntensity: number;
    ground: GroundMesh | undefined;
    grassTaskCounter: number;

    constructor(engine: Engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine)

        this.gravityIntensity = -0.02;
        this.collisionsEnabled = true;
        this.grassTaskCounter = 0;
    }

    createGround() {
        const groundName = "ground1";
        const heightmapTexture = "http://localhost:3000/textures/aerial_rocks_04_rough_8k.jpg";

        let ground: GroundMesh;

        // ground = MeshBuilder.CreateGround(
        //     groundName,
        //     {
        //         ...groundParameters
        //     },
        // )
        // ground.checkCollisions = true;
        let scene = this;

        ground = MeshBuilder.CreateGroundFromHeightMap(
            groundName,
            heightmapTexture,
            {
                ...groundParameters,
                onReady: function (ground: GroundMesh) {
                    ground.position.y -= groundParameters.maxHeight;
                    ground.checkCollisions = true;
                    scene.ground = ground;
                    console.log("Ground is READY");
                    ground.isPickable = true
                },

            },
            this
        );

        // in future replace with : http://127.0.0.1:3000/models/
        SceneLoader.Append("https://raw.githubusercontent.com/proace137/assets/master/", "testmap.glb", scene, function (scene) {
            let mesh = scene.getMeshByName("Plane") as Mesh;
            mesh.isPickable = true;
            mesh.scaling = new Vector3(20, 20, 20)

            mesh.bakeCurrentTransformIntoVertices();


            var myGround = MeshBuilder.CreateGround("myGround", { width: 1000, height: 1000, subdivisions: 8 }, scene);
            myGround.position.x -= 5

            let data = VertexData.ExtractFromMesh(mesh);

            data.applyToMesh(myGround);
            myGround.flipFaces();

            mesh.setEnabled(false);
            ws.night_monster_list.set("Tester", new AvatarFictive(scene, "Tester"));
        });

    }
};