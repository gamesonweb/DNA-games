import { Engine, GroundMesh, MeshBuilder, Scene, SceneLoader } from "babylonjs";
import { AvaterInterface as AvatarInterface } from "../../AvatarInterface";

export class MyScene extends Scene {
    gravityIntensity: number;
    acceleration: number;
    ground: GroundMesh | undefined;
    grassTaskCounter: number;

    constructor(engine: Engine) {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine)

        this.createGround();

        this.gravityIntensity = -0.02;
        this.acceleration = this.gravityIntensity;
        this.collisionsEnabled = true;
        this.grassTaskCounter = 0;
    }

    createGround() {
        const groundName = "ground1";
        const heightmapTexture = "http://localhost:3000/textures/aerial_rocks_04_rough_8k.jpg";

        const groundWidth = 100;
        const groundLenght = 100;

        const groundMinheight = -1;
        const groundMaxheight = 2;

        let groundOptions = () => {
            return {
                width: groundWidth,
                height: groundLenght,
                subdivisions: 32,
                minHeight: groundMinheight,
                maxHeight: groundMaxheight,

                onReady: () => onGroundCreated(),
            }
        }

        var ground = MeshBuilder.CreateGroundFromHeightMap(
            groundName,
            heightmapTexture,
            groundOptions(),
            this
        );

        console.log("ground: " + ground);


        let onGroundCreated = () => {
            ground.checkCollisions = true;
            ground.position.y -= groundMaxheight;
            this.ground = ground;
        }
    }

    applyGravity(mesh: AvatarInterface) {
        //sphere1?.moveWithCollisions(new Vector3(0, -0.5, 0))
        if (mesh) {
            var hits = this.multiPickWithRay(mesh.ray, (m) => { return m.isPickable });

            var filtered = (hits?.filter(e => (mesh?.shape != undefined) && e.pickedMesh?.name !== mesh?.shape.name))

            //if object detected but to high
            if (filtered !== undefined && filtered.length > 0) {
                var hit = filtered[0]
                if (hit !== null && hit.pickedPoint && mesh.position.y > hit.pickedPoint.y + 1.2) {
                    mesh.position.y += this.acceleration;
                } else {
                    this.acceleration = this.gravityIntensity;
                    mesh.canJump = true;
                }
                //else above the void
            } else {
                console.log("Going down ?");

                mesh.position.y += this.acceleration * 2;
                this.acceleration += this.gravityIntensity * 0.2;
            }
        }
    }
};