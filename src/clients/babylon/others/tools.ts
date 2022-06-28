import { Axis, Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "babylonjs-gui";
import { windowExists } from "../../reactComponents/tools";
import { Avatar } from "../avatars/avatarHeavy";

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


export function getTimeToString() {
    var today = new Date();
    var hours = today.getHours().toString()
    var minutes = today.getMinutes().toString()
    var time = "[" + (hours.length === 2 ? '' : '0') + hours + ":" + (minutes.length === 2 ? '' : '0') + minutes + "]";
    return time
}

export function isVector3Equal(v1: Vector3, v2: Vector3) {
    return (v1.x === v2.x) && (v1.y === v2.y) && (v1.z === v2.z)
}


export var createLabel = function (text: string, mesh: Avatar, scene: Scene) {
    var plane = MeshBuilder.CreatePlane("plane", { size: 5 }, scene);
    plane.billboardMode = Mesh.BILLBOARDMODE_Y;
    plane.position.y = 1.5;

    if (windowExists()) {
        var advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);

        var rect1 = new Rectangle();
        rect1.width = 1;
        rect1.height = 1;
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
        label.fontSize = 80;

        label.outlineWidth = 10;
        label.outlineColor = "black";
    }
    return plane
}


export function createWall(scene: Scene) {
    let wall = MeshBuilder.CreateBox("wall", { height: 50, width: 2, depth: 0.2 }, scene);
    wall.position = new Vector3(10, 1, -10)
    wall.rotate(Axis.X, Math.PI / 2.5)
    wall.checkCollisions = true;

    var wallMaterial = new StandardMaterial("wallMat", scene);

    wallMaterial.diffuseColor = new Color3(0.6, 0.165, 0.11);
    wall.material = wallMaterial;

    wall.receiveShadows = true;
    return wall
}