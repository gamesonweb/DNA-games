import { DynamicTexture, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";

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
    return Math.sqrt((a.x - b.x) ** 2 + (a.y + b.y) ** 2 + (a.z + b.z) ** 2);
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

export function createTextOnPlane(txt: string, scene: Scene) {
    //Set font
    var font_size = 12;
    var font = "bold " + font_size + "px Arial";

    //Set height for plane
    var planeHeight = 1;

    //Set height for dynamic texture
    var DTHeight = 1.5 * font_size; //or set as wished

    //Calcultae ratio
    var ratio = planeHeight / DTHeight;

    //Set text
    var text = txt;

    //Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
    var temp = new DynamicTexture("DynamicTexture", 64, scene);
    var tmpctx = temp.getContext();
    tmpctx.font = font;
    var DTWidth = tmpctx.measureText(text).width + 8;

    //Calculate width the plane has to be 
    var planeWidth = DTWidth * ratio;

    //Create dynamic texture and write the text
    var dynamicTexture = new DynamicTexture("DynamicTexture", { width: DTWidth, height: DTHeight }, scene, false);
    var mat = new StandardMaterial("mat", scene);
    mat.diffuseTexture = dynamicTexture;
    dynamicTexture.drawText(text, null, null, font, "#000000", "#ffffff", true);

    //Create plane and set dynamic texture as material
    var plane = MeshBuilder.CreatePlane("plane", { width: planeWidth, height: planeHeight }, scene);
    plane.material = mat;
    return plane;
}