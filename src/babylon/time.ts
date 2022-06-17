import { light } from "./main";

export var hour: number

export function updateHour(hourInput: number) {
    console.log("updating time to " + hourInput);
    hour = hourInput;

    //pleine nuit
    if (hour == 23 || hour < 5) { light.intensity = 0.2; }

    //levée du jour
    else if (hour >= 5 && hour < 10) { light.intensity = (hour - 2) / 10; }

    //journée
    else if (hour >= 10 && hour < 17) { light.intensity = 0.8; }

    //couché du soleil
    else if (hour >= 17 && hour < 23) { light.intensity = (25 - hour) / 10 }
}