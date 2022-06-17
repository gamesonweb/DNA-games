import { Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "babylonjs-gui";
import { Avatar } from "./avatar";

export function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function distance(a: Vector3, b: Vector3) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

/** Remove elt from L with side effect */
export function removeFromList<T>(elt: T, l: T[]) {
    let pos = l.indexOf(elt)
    if (pos >= 0) l.splice(pos, 1)
}


export function getTime() {
    var today = new Date();
    var hours = today.getHours().toString()
    var minutes = today.getMinutes().toString()
    var time = "[" + (hours.length == 2 ? '' : '0') + hours + ":" + (minutes.length == 2 ? '' : '0') + minutes + "]";
    return time
}


export var createLabel = function (text: string, mesh: Avatar) {
    var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("PlaneFor" + mesh.avatar_username);

    var rect1 = new Rectangle();
    rect1.width = 0.2;
    rect1.height = "40px";
    rect1.cornerRadius = 20;
    rect1.color = "White";
    rect1.thickness = 0;
    rect1.background = "transparent";
    advancedTexture.addControl(rect1);
    rect1.linkWithMesh(mesh);
    rect1.linkOffsetY = -80;

    const label = new TextBlock();
    label.text = text;
    label.color = "white"
    rect1.addControl(label);

    label.outlineWidth = 4;
    label.outlineColor = "black";
    return rect1
}
