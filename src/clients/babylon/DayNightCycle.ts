import { Animation, AnimationGroup, Color3 } from "babylonjs";
import { scene } from "./main";
import { light } from "./scene";

export function createDayNightCycle(origin: number): AnimationGroup {
    //s = Time Interval Server 24h => 24 * 4 * 0.5 sec = 48 sec
    //c = Time Interval Client 24h => 2400/60 sec = 40 sec
    //Ratio = s/c = 1.2
    var ratio = 1.2;

    //Sky color
    var animationSky = createSkyAnimation(ratio);

    //Light intensity
    var animationLight = createLightAnimation(ratio);

    // Create the animation group
    var animationGroup = new AnimationGroup("skyAnimGroup");
    animationGroup.addTargetedAnimation(animationSky, scene);
    animationGroup.addTargetedAnimation(animationLight, light);
    animationGroup.normalize(0, 2400 * ratio);

    // Start the animation to the current time
    animationGroup.play();
    animationGroup.goToFrame(origin * 100 * ratio);

    //Launch the looping animation
    animationGroup.play(true);

    //Then add the animation object to scene
    //this.animations.push(animationSky);

    //Launch animations on scene, from key 0 to key 2400 with loop activated
    //this.beginAnimation(this, beginning, 2400, true);

    return animationGroup;
}

export function createSkyAnimation(ratio: number): Animation {
    //Sky Color

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

    return animationSky
}

export function createLightAnimation(ratio: number) {
    //Light intensity

    //Create a scaling animation at 60 FPS
    var animationLight = new Animation("animationLight", "intensity", 60, Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keys = [];

    keys.push({
        frame: 0,
        value: 0.2
    });


    keys.push({
        frame: 500 * ratio,
        value: 0.2
    });

    keys.push({
        frame: 1100 * ratio,
        value: 0.8
    });

    keys.push({
        frame: 1700 * ratio,
        value: 0.8
    });

    keys.push({
        frame: 2300 * ratio,
        value: 0.2
    });

    keys.push({
        frame: 2400 * ratio,
        value: 0.2
    });

    //Adding keys to the animation object
    animationLight.setKeys(keys);

    return animationLight
}