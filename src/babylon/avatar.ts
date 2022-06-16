import { Axis, Mesh, MeshBuilder, Quaternion, Scene, Vector3, Matrix, StandardMaterial, Color3 } from "babylonjs";
import { Bullet } from "./bullet";
import { createTextOnPlane, getTime, makeInputVisible, writeMessageInChat } from "./tools";
import { sendMessage, ws } from "./connectionWS";
import { sphere1 } from "./main";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: string;
  bulletList: Bullet[];
  speed_coeff: number;
  didSomething: Boolean;

  constructor(scene: Scene, avatar_username: string, username: string) {
    super("Avatar" + Avatar.counter, scene);
    this.name = "Avatar" + Avatar.counter
    this.counter = Avatar.counter;
    Avatar.counter += 3;
    let sphere = MeshBuilder.CreateSphere(this.name + "sp1", { segments: 16, diameter: 2 }, scene);
    let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene);

    this.checkCollisions = true;
    if (avatar_username != username) {
      sphere.checkCollisions = true;
    }
    var myMaterial = new StandardMaterial("myMaterial", scene);

    myMaterial.diffuseColor = new Color3(0, 1, 0);
    sphere.material = myMaterial;

    sphere.parent = this;
    this.addChild(sphere)
    this.addChild(queue)
    queue.position = new Vector3(0, 0, -1);
    this.sphere = sphere;
    this.bulletList = [];
    this.speed_coeff = 0.15;
    this.didSomething = false;

    this.avatar_username = avatar_username;

    let plane = createTextOnPlane(this.avatar_username, scene)
    this.addChild(plane)
    plane.position.y = 2
    this.position = new Vector3(this.counter, 1, 0);
  }

  move(evt: string) {
    this.didSomething = true;
    let direction = this.getDirection(Axis.Z)
    switch (evt) {
      case "KeyW": {
        //this.position.x = this.position.x + direction.x * this.speed_coeff;
        //this.position.z = this.position.z + direction.z * this.speed_coeff;
        this.moveWithCollisions(direction.scale(this.speed_coeff));
        break;
      }
      case "KeyS": {
        //this.position.x = this.position.x - direction.x * this.speed_coeff;
        //this.position.z = this.position.z - direction.z * this.speed_coeff;
        this.moveWithCollisions(direction.scale(-this.speed_coeff));
        break;
      }
      case "KeyD": {
        direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
        //this.position.x = this.position.x + direction.x * this.speed_coeff;
        //this.position.z = this.position.z + direction.z * this.speed_coeff;
        this.moveWithCollisions(direction.scale(this.speed_coeff));
        break;
      }
      case "KeyA": {
        direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
        //this.position.x = this.position.x - direction.x * this.speed_coeff;
        //this.position.z = this.position.z - direction.z * this.speed_coeff;
        this.moveWithCollisions(direction.scale(-this.speed_coeff));
        break;
      }
      case "Space": {
        this.addBullet()
        ws.send(
          JSON.stringify({
            route: "fireBullet",
            content: this.avatar_username
          }))
        break;
      }
      case "ArrowRight": {
        this.rotate(Axis.Y, +0.5)
        break
      }
      case "ArrowLeft": {
        this.rotate(Axis.Y, -0.5)
        break
      }

      case "Enter": {
        makeInputVisible()
      }
    }
  }

  addBullet(displayOnly = false) {
    this.bulletList.push(new Bullet(this, displayOnly))
  }

  updateBulletPosition() {
    this.bulletList.forEach(e => e.update())
  }

  dispose(): void {
    super.dispose()
  }
}

export function addAvatar(scene: Scene, avatar_username: string) {
  return new Avatar(scene, avatar_username, "")
}

export function sendMessageFromPlayer(msg: string) {
  var time = getTime()
  if (sphere1) {
    writeMessageInChat(time, sphere1.avatar_username, msg, true)
    sendMessage(time, msg)
  }
}