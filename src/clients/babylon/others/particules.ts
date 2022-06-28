import { Animation, Color4, Mesh, ParticleSystem, Texture, Vector3 } from "babylonjs";
import { scene } from "../main";

export function createFire(emitter: Mesh) {
    //Smoke
    var smokeSystem = new ParticleSystem("particles", 1000, scene);
    smokeSystem.particleTexture = new Texture("./textures/flare.png", scene);
    smokeSystem.minEmitBox = new Vector3(-0.5, 1, -0.5); // Starting all from
    smokeSystem.maxEmitBox = new Vector3(0.5, 1, 0.5); // To...

    smokeSystem.color1 = new Color4(0.02, 0.02, 0.02, .02);
    smokeSystem.color2 = new Color4(0.02, 0.02, 0.02, .02);
    smokeSystem.colorDead = new Color4(0, 0, 0, 0.0);

    smokeSystem.minSize = 1;
    smokeSystem.maxSize = 3;

    smokeSystem.minLifeTime = 0.3;
    smokeSystem.maxLifeTime = 1.5;

    smokeSystem.emitRate = 350;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    smokeSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    smokeSystem.gravity = new Vector3(0, 0, 0);

    smokeSystem.direction1 = new Vector3(-1.5, 8, -1.5);
    smokeSystem.direction2 = new Vector3(1.5, 8, 1.5);

    smokeSystem.minAngularSpeed = 0;
    smokeSystem.maxAngularSpeed = Math.PI;

    smokeSystem.minEmitPower = 0.5;
    smokeSystem.maxEmitPower = 1.5;
    smokeSystem.updateSpeed = 0.005;
    smokeSystem.emitter = emitter
    smokeSystem.disposeOnStop = true;

    // smokeSystem.start();



    // Create a particle system
    var fireSystem = new ParticleSystem("particles", 2000, scene);

    //Texture of each particle
    fireSystem.particleTexture = new Texture("./textures/flare.png", scene);

    // Where the particles come from
    fireSystem.minEmitBox = new Vector3(-0.25, 0, -0.25); // Starting all from
    fireSystem.maxEmitBox = new Vector3(0.25, 0, 0.25); // To...

    // Colors of all particles
    fireSystem.color1 = new Color4(1, 0.5, 0, 1.0);
    fireSystem.color2 = new Color4(1, 0.5, 0, 1.0);
    fireSystem.colorDead = new Color4(0, 0, 0, 0.0);

    // Size of each particle (random between...
    fireSystem.minSize = 0.1;
    fireSystem.maxSize = 0.8;

    // Life time of each particle (random between...
    fireSystem.minLifeTime = 0.2;
    fireSystem.maxLifeTime = 0.5;

    // Emission rate
    fireSystem.emitRate = 600;

    // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    fireSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

    // Set the gravity of all particles
    fireSystem.gravity = new Vector3(0, 20, 0);

    // Direction of each particle after it has been emitted
    // fireSystem.direction1 = new Vector3(0, 4, 0);
    // fireSystem.direction2 = new Vector3(0, 4, 0);

    // Angular speed, in radians
    fireSystem.minAngularSpeed = 0;
    fireSystem.maxAngularSpeed = Math.PI;

    // Speed
    fireSystem.minEmitPower = 0.5;
    fireSystem.maxEmitPower = 2;
    fireSystem.updateSpeed = 0.005;

    fireSystem.disposeOnStop = true;

    fireSystem.emitter = emitter.position.add(new Vector3(0, 0.5, 0));

    // Start the particle system
    fireSystem.start();
}

export function createFireAnimation(): Animation {
    //Light intensity

    //Create a scaling animation at 60 FPS
    var animationFireLight = new Animation("animFireLight", "intensity", 15, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keys = [];

    keys.push({
        frame: 0,
        value: 1
    });

    keys.push({
        frame: 10,
        value: 0.8
    });
    keys.push({
        frame: 20,
        value: 0.3
    });
    keys.push({
        frame: 30,
        value: 0.8
    });
    keys.push({
        frame: 40,
        value: 0.6
    });

    keys.push({
        frame: 50,
        value: 1.5
    });
    keys.push({
        frame: 60,
        value: 0.6
    });
    keys.push({
        frame: 70,
        value: 1.2
    });
    keys.push({
        frame: 80,
        value: 0.7
    });
    keys.push({
        frame: 90,
        value: 0.5
    });

    keys.push({
        frame: 100,
        value: 0.8
    });


    //Adding keys to the animation object
    animationFireLight.setKeys(keys);

    return animationFireLight
}