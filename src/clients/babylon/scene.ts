import { FreeCamera, DirectionalLight, MeshBuilder, Scene, Sprite, SpriteManager, StandardMaterial, Texture, Vector3, ShadowGenerator, Animation, AnimationGroup, Color3, Color4 } from "babylonjs";
import { canvas, engine, sphere1 } from "./main";
import { createWall } from "./tools";
import { hour } from "./time";
export var light: DirectionalLight;

export class MyScene extends Scene {
    gravityIntensity: number;
    acceleration: number

    constructor() {
        // This creates a basic Babylon Scene object (non-mesh)
        super(engine!)

        window.scene = this;

        this.createCamera()
        this.createLight()
        this.createGround()
        createWall()

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
    }

    createGround() {
        // Our built- shape. Params: name, width, depth, subdivs, scene
        var ground = MeshBuilder.CreateGround("ground1", { width: 100, height: 100, subdivisions: 2 }, this);
        const groundMaterial = new StandardMaterial("groundMaterial", this);
        groundMaterial.diffuseTexture = new Texture("./img/grass.png");
        ground.material = groundMaterial;
        ground.checkCollisions = true;
        //ground.rotate(Axis.Z, 0.5)

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

    createShadows() {
        var shadowGenerator = new ShadowGenerator(1024, light);
    }

    /*createSky() {
        this.clearColor = new Color4(135 / 255, 206 / 255, 235 / 255, 1);
    }*/

    createSkyAnimation(beginning: number) {
        //s = Time Interval Server 24h => 24 * 4 * 0.5 sec = 48 sec
        //c = Time Interval Client 24h => 2400/60 sec = 40 sec
        //Ratio = s/c = 1.2
        var ratio = 1.2
        //Create a scaling animation at 60 FPS
        var animationSky = new Animation("animationSky", "clearColor", 60, Animation.ANIMATIONTYPE_COLOR3,
            Animation.ANIMATIONLOOPMODE_CYCLE);

        // Animation keys
        var keys = [];
        //At the animation key 0 (00h00), the value of color is "rgb(0, 0, 0)" (night)
        keys.push({
            frame: 0,
            value: new Color3(0, 0, 0)
        });


        keys.push({
            frame: 500 * ratio,
            value: new Color3(0, 0, 0)
        });


        //At the animation key 800 (08h00), the value of color is "rgb(228 / 255, 105 / 255, 46 / 255)" (Sunrise color)
        keys.push({
            frame: 800 * ratio,
            value: new Color3(228 / 255, 105 / 255, 46 / 255)
        });

        //At the animation key 1100 (11h00), the value of color is "rgb(0, 0, 0)" (blue sky)
        keys.push({
            frame: 1100 * ratio,
            value: new Color3(135 / 255, 206 / 255, 235 / 255)
        });

        keys.push({
            frame: 1700 * ratio,
            value: new Color3(135 / 255, 206 / 255, 235 / 255)
        });

        //At the animation key 1100 (11h00), the value of color is "rgb(227 / 255, 169 / 255, 136 / 255)" (Sunset color)
        keys.push({
            frame: 2000 * ratio,
            value: new Color3(227 / 255, 169 / 255, 136 / 255)
        });

        keys.push({
            frame: 2300 * ratio,
            value: new Color3(0, 0, 0)
        });

        keys.push({
            frame: 2400 * ratio,
            value: new Color3(0, 0, 0)
        });

        //Adding keys to the animation object
        animationSky.setKeys(keys);

        // Create the animation group
        var animationGroup = new AnimationGroup("skyAnimGroup");
        animationGroup.addTargetedAnimation(animationSky, this);
        animationGroup.normalize(0, 2400 * ratio);

        // Start the animation to the current time
        animationGroup.play()
        animationGroup.goToFrame(beginning * 100 * ratio);

        //Launch the looping animation
        animationGroup.play(true);

        //Then add the animation object to scene
        //this.animations.push(animationSky);

        //Launch animations on scene, from key 0 to key 2400 with loop activated
        //this.beginAnimation(this, beginning, 2400, true);
    }

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