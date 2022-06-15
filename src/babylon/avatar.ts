import { Axis, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { Bullet } from "./bullet";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: String;
  bulletList: Bullet[];

  constructor(scene1: Scene, avatar_username: String) {
    super("Avatar" + Avatar.counter, scene1);
    this.name = "Avatar" + Avatar.counter
    this.counter = Avatar.counter;
    Avatar.counter++;
    this.position = new Vector3(this.counter, 1, 0);
    let sphere = MeshBuilder.CreateSphere(this.name + "sp1", { segments: 16, diameter: 2 }, scene1);
    let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene1);
    sphere.parent = this;
    this.addChild(sphere)
    this.addChild(queue)
    queue.position = new Vector3(0, 0, -1);
    this.sphere = sphere;
    this.bulletList = [];

    this.avatar_username = avatar_username;
    // this.cameraAvatar = new FollowCamera(this.name + "Camera", this.position.multiply(new Vector3(1, -1, 1)), scene, this);
    // this.cameraAvatar.rotationOffset = 180;
    // var text1 = new BABYLON.GUI.TextBlock();
    // text1.text = this.avatar_username.toString();
    // text1.color = "white";
    // text1.fontSize = 24;
    //var outputplaneTexture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
    // this.addChild(text1);
    //text1.parent = this.sphere;
    // J'ai essayé ça en l'initalisisant dans la scene mais ça n'a pas marché: advancedTexture.addControl(text1);
    // text1.linkWithMesh(this.sphere);
    // text1.parent(sphere);
    // text1.linkOffsetX = 0;
    // text1.linkOffsetY = -150;
  }

  move(evt: string) {
    switch (evt) {
      case "KeyW": {
        this.position.z++;
        break;
      }
      case "KeyS": {
        this.position.z--;
        break;
      }
      case "KeyD": {
        this.position.x++;
        break;
      }
      case "KeyA": {
        this.position.x--;
        break;
      }
      case "Space": {
        this.addBullet()
        break;
      }
      case "ArrowRight": {
        this.rotate(Axis.Y, -0.5)
        break
      }
      case "ArrowLeft": {
        this.rotate(Axis.Y, +0.5)
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

export function addAvatar(scene: Scene, avatar_username: String) {
  return new Avatar(scene, avatar_username)
}