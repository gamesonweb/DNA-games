import { Axis, Mesh, MeshBuilder, Quaternion, Scene, Vector3, Matrix } from "babylonjs";
import { Bullet } from "./bullet";
import { createTextOnPlane } from "./tools";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: string;
  bulletList: Bullet[];
  speed_coeff: number;

  constructor(scene: Scene, avatar_username: string) {
    super("Avatar" + Avatar.counter, scene);
    this.name = "Avatar" + Avatar.counter
    this.counter = Avatar.counter;
    Avatar.counter++;
    let sphere = MeshBuilder.CreateSphere(this.name + "sp1", { segments: 16, diameter: 2 }, scene);
    let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene);
    sphere.parent = this;
    this.addChild(sphere)
    this.addChild(queue)
    queue.position = new Vector3(0, 0, -1);
    this.sphere = sphere;
    this.bulletList = [];
    this.speed_coeff = 0.15;

    this.avatar_username = avatar_username;

    let plane = createTextOnPlane(this.avatar_username, scene)
    this.addChild(plane)
    plane.position.y = 2
    this.position = new Vector3(this.counter, 1, 0);
  }

  move(evt: string) {
    let direction = this.getDirection(Axis.Z)
    switch (evt) {
      case "KeyW": {
        this.position.x = this.position.x + direction.x * this.speed_coeff;
        this.position.z = this.position.z + direction.z * this.speed_coeff;
        break;
      }
      case "KeyS": {
        this.position.x = this.position.x - direction.x * this.speed_coeff;
        this.position.z = this.position.z - direction.z * this.speed_coeff;
        break;
      }
      case "KeyD": {
        direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
        this.position.x = this.position.x + direction.x * this.speed_coeff;
        this.position.z = this.position.z + direction.z * this.speed_coeff;
        break;
      }
      case "KeyA": {
        direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
        this.position.x = this.position.x - direction.x * this.speed_coeff;
        this.position.z = this.position.z - direction.z * this.speed_coeff;
        break;
      }
      case "Space": {
        this.addBullet()
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
    }
  }

  addBullet() {
    this.bulletList.push(new Bullet(this))
  }

  updateBulletPosition() {
    this.bulletList.forEach(e => e.update())
  }

  dispose(): void {
    super.dispose()
  }
}

export function addAvatar(scene: Scene, avatar_username: string) {
  return new Avatar(scene, avatar_username)
}