import { Axis, Color3, FollowCamera, Mesh, MeshBuilder, Ray, RayHelper, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle, TextBlock } from "babylonjs-gui";
import { windowExists } from "../../reactComponents/tools";
import { Avatar } from "../avatars/avatarHeavy";
import { AvatarSoft } from "../avatars/avatarSoft";
import { sphere1 } from "../main";

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
        rect1.linkWithMesh(mesh.shape);
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

export function createBasicShape(avatar_username: String, scene: Scene) {
    let model = MeshBuilder.CreateCylinder(avatar_username + "sp1", { diameter: 1, height: 2 }, scene);
    let queue = MeshBuilder.CreateSphere(avatar_username + "sp2", { segments: 16, diameter: 0.3 }, scene);

    var myMaterial = new StandardMaterial("myMaterial", scene);

    myMaterial.diffuseColor = new Color3(0.3, 0.5, 1);
    model.material = myMaterial;
    model.addChild(queue)
    queue.position = new Vector3(0, 0, -0.3);
    return model
}

export function adjustCameraPosition(scene: Scene, sphere1: AvatarSoft) {
    let followCam = scene.activeCamera as FollowCamera

    //VERSION WITH DO WHILE

    var hit: any
    var iter = 0
    do {
        iter++
        var ray = new Ray(followCam.position.subtract(followCam.getDirection(Axis.Z).scale(2)).subtract(new Vector3(0, 1, 0)), followCam.getDirection(Axis.Z), 15);
        // var rayHelper = new RayHelper(ray);
        // rayHelper.show(scene); 
        hit = scene.pickWithRay(ray);
        // console.log("picked mesh with Camera's ray: ", hit);
        if (hit.pickedMesh) {
            if (hit.pickedMesh !== sphere1.shape) {
                if (followCam.radius >= 0.2) followCam.radius -= 0.2
            } else {
                if (followCam.radius < 10) {
                    var backRay = new Ray(followCam.position.subtract(new Vector3(0, 1, 0)), followCam.getDirection(Axis.Z).negate(), 1);
                    var backHit = scene.pickWithRay(backRay)
                    if (!backHit?.pickedMesh || backHit.pickedMesh == sphere1.shape) followCam.radius += 0.2
                }
            }
        } else { followCam.radius -= 0.2 }
    } while (hit.pickedMesh !== sphere1.shape && iter < 30)

    //VERSION WITH PICKEDPOINT

    // var ray = new Ray(followCam.position.subtract(followCam.getDirection(Axis.Z).scale(10)).subtract(new Vector3(0, 1, 0)), followCam.getDirection(Axis.Z), 20);
    // var hit = scene.pickWithRay(ray);
    // console.log("picked mesh with Camera's ray: ", hit);
    // if (hit) {
    //     if (hit.pickedMesh !== sphere1.shape) {
    //         // if (followCam.radius >= 0.2) followCam.radius -= 0.2
    //         if (hit.pickedPoint) followCam.radius = Math.max(0, distance(sphere1.shape.position, hit.pickedPoint) - 4)
    //         else { followCam.radius -= 0.5 }
    //     } else { followCam.radius += 0.2 }
    // }
    // if (followCam.radius > 10) followCam.radius = 10
}