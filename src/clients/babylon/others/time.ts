import { Animation } from "babylonjs";
import { scene } from "../main";
import { createDayNightCycle, syncAnimGroup } from "../scene/dayNightCycle";
import { light } from "../scene/sceneClient";

export var hour: number;
export var skyDefined: boolean = false;

export function updateHour(hourInput: number) {
    if (scene && typeof scene !== 'undefined' && !skyDefined) {
        createDayNightCycle(hourInput);
        skyDefined = true;
    }
    hour = hourInput;

    //if (hour % 1 == 0) console.log("updating time to " + hour);

    if (skyDefined) {
        if (hour === 12 || hour === 0) syncAnimGroup(hour)
    }

    //tue les monstres de nuit si il fait jour
    // if (hour > 7 && hour < 22) {
    //     for (const value of wsClient.night_monster_list.values()) {
    //         value.dispose();
    //     }
    //     wsClient.night_monster_list.clear();
    // }
    /*Replaced by dedicated animation in DayNightCycle.js

    //pleine nuit
    if (hour > 23 || hour < 5) { light.intensity = 0.2; }

    //levée du jour
    else if (hour >= 5 && hour <= 11) { smoothLightTransition(light.intensity, (hour - 3) / 10); }

    //journée
    else if (hour > 11 && hour < 17) { light.intensity = 0.8; }

    //couché du soleil
    else if (hour >= 17 && hour <= 23) { smoothLightTransition(light.intensity, (25 - hour) / 10); }*/
}

function smoothLightTransition(start: number, end: number) {
    Animation.CreateAndStartAnimation("animMove", light, "intensity", 60, 60, start, end, Animation.ANIMATIONLOOPMODE_CONSTANT);

}