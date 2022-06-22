import { FreeCamera, DirectionalLight, HemisphericLight, MeshBuilder, Scene, Sprite, SpriteManager, StandardMaterial, Texture, Vector3, ShadowGenerator, Animation, AnimationGroup, Color3, Color4 } from "babylonjs";
import { canvas, engine, sphere1 } from "./main";
import { createWall } from "./tools";
export var light: DirectionalLight;
export var hemiLight: HemisphericLight;

export class MyScene extends Scene {
    gravityIntensity: number;
    acceleration: number;
    shadowGenerator: ShadowGenerator

    constructor() {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine!)

        window.scene = this;

        this.createCamera()
        this.createLight()
        this.createGround()
        this.shadowGenerator = this.createShadows()
        this.shadowGenerator.addShadowCaster(createWall())

        this.createSprites()

        // sphere1 = new Avatar(scene, "Well", "");
        this.gravityIntensity = -0.02;
        this.acceleration = this.gravityIntensity;
        this.collisionsEnabled = true;

        this.beforeRender = () => {

            sphere1?.isJumping ? this.applyJump() : this.applyGravity()
        }
    }

    createCamera() {
        // This creates and positions a free camera (non-mesh)
        var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this);

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);
    }

    createLight() {
        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        //light = new HemisphericLight("light1", new Vector3(0, 1, 0), this);
        light = new DirectionalLight("light1", new Vector3(-1, -2, -1), this);
        light.position = new Vector3(0, 40, 0);

        // Default intensity is 1.
        light.intensity = 0.7;

        hemiLight = new HemisphericLight("light2", new Vector3(0, 1, 0), this);
        hemiLight.intensity = 0.35;
    }

    createGround() {
        // Our built- shape. Params: name, width, depth, subdivs, scene
        var ground = MeshBuilder.CreateGround("ground1", { width: 100, height: 100, subdivisions: 2 }, this);
        const groundMaterial = new StandardMaterial("groundMaterial", this);
        groundMaterial.diffuseTexture = new Texture("./img/grass.png");
        ground.material = groundMaterial;
        ground.checkCollisions = true;
        ground.receiveShadows = true;

    }

    createSprites() {
        var spriteManagerTrees = new SpriteManager("grassesManager", "./img/herb.png", 2000, 800, this);

        //Creation of 2000 trees at random positions
        for (var i = 0; i < 2000; i++) {
            let herb = new Sprite("herb", spriteManagerTrees);
            herb.height = Math.random() * 2
            herb.width = Math.random() * 2
            herb.position.x = Math.random() * 50 - 25;
            herb.position.z = Math.random() * 50 - 25;
            herb.position.y = 0.5;
        }
    }

    createShadows(): ShadowGenerator {
        let shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_LOW;
        shadowGenerator.darkness = 0.2;

        //Makes the shadow blurred (but shadow disappear if above a mesh)
        // shadowGenerator.useBlurExponentialShadowMap = true;
        // shadowGenerator.useKernelBlur = true;
        // shadowGenerator.blurKernel = 4;
        // shadowGenerator.blurScale = 1;

        //Transparent mesh
        // shadowGenerator.transparencyShadow = true;
        // shadowGenerator.enableSoftTransparentShadow = true;
        return shadowGenerator
    }

    /*createSky() {
        this.clearColor = new Color4(135 / 255, 206 / 255, 235 / 255, 1);
    }*/


    applyGravity() {
        //sphere1?.moveWithCollisions(new Vector3(0, -0.5, 0))
        if (sphere1) {
            var hits = this.multiPickWithRay(sphere1.ray, (m) => { return m.isPickable });

            var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

            //if object detected but to high
            if (filtered !== undefined && filtered.length > 0) {
                var hit = filtered[0]
                if (hit !== null && hit.pickedPoint && sphere1.position.y > hit.pickedPoint.y + 1.2) {
                    sphere1.position.y += this.acceleration;
                } else {
                    this.acceleration = this.gravityIntensity;
                    sphere1.canJump = true;
                }
                //else above the void
            } else {
                sphere1.position.y += this.acceleration * 2;
                this.acceleration += this.gravityIntensity * 0.2;
            }
        }
    }

    applyJump() {
        if (sphere1) {
            var hits = this.multiPickWithRay(sphere1.jumpRay, (m) => { return m.isPickable });

            var filtered = (hits?.filter(e => e.pickedMesh?.name !== sphere1?.sphere.name))

            if (filtered !== undefined && filtered.length > 0) {
                var hit = filtered[0]
                if (hit !== null && hit.pickedPoint && sphere1.position.y < hit.pickedPoint.y - 1.2) {
                    sphere1.position.y -= this.gravityIntensity
                }
            } else {
                sphere1.position.y -= this.gravityIntensity * 10
            }
        }
    }

};