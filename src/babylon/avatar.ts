import { Axis, Color3, Mesh, MeshBuilder, Quaternion, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { Container } from "babylonjs-gui";
import { Bullet } from "./bullet";
import { ws } from "./connectionWS";
import { inputStates } from "./inputListeners";
import { createLabel } from "./tools";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: string;
  bulletList: Bullet[];
  speed_coeff: number;
  didSomething: Boolean;
  usernamePanel: Container;

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
    this.speed_coeff = 0.20;
    this.didSomething = false;

    this.avatar_username = avatar_username;

    // let plane = createTextOnPlane(this.avatar_username, scene)
    // this.addChild(plane)
    this.usernamePanel = createLabel(this.avatar_username, this);
    this.position = new Vector3(this.counter, 1, 0);
  }

  move() {

    if (inputStates.D || inputStates.Q || inputStates.S || inputStates.Z || inputStates.right || inputStates.left)
      this.didSomething = true;

    let direction = this.getDirection(Axis.Z)

    let coeff_diagonal = 1
    if ((inputStates.Z || inputStates.S) && (inputStates.Q || inputStates.D)) coeff_diagonal = Math.PI / 4;

    //forward/backward movement
    if (inputStates.Z) {
      this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal));
    } else if (inputStates.S) {
      this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 2));
    }

    //left/right movement
    if (inputStates.Q) {
      direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
      this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 1.5));
    } else if (inputStates.D) {
      direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
      this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal / 1.5));
    }

    //Rotation
    if (inputStates.right) {
      this.rotate(Axis.Y, +0.05)
    } else if (inputStates.left) {
      this.rotate(Axis.Y, -0.05)
    }

    //add bullet -will become jump later => jump on space and attack on leftMouseClick
    if (inputStates.space) {
      this.addBullet()
      ws.send(
        JSON.stringify({
          route: "fireBullet",
          content: this.avatar_username
        }))
    }

    // switch (evt) {
    //   case "KeyW": {
    //     //this.position.x = this.position.x + direction.x * this.speed_coeff;
    //     //this.position.z = this.position.z + direction.z * this.speed_coeff;
    //     this.moveWithCollisions(direction.scale(this.speed_coeff));
    //     break;
    //   }
    //   case "KeyS": {
    //     //this.position.x = this.position.x - direction.x * this.speed_coeff;
    //     //this.position.z = this.position.z - direction.z * this.speed_coeff;
    //     this.moveWithCollisions(direction.scale(-this.speed_coeff));
    //     break;
    //   }
    //   case "KeyD": {
    //     direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
    //     this.moveWithCollisions(direction.scale(this.speed_coeff));
    //     //this.position.x = this.position.x + direction.x * this.speed_coeff;
    //     //this.position.z = this.position.z + direction.z * this.speed_coeff;
    //     break;
    //   }
    //   case "KeyA": {
    //     direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
    //     this.moveWithCollisions(direction.scale(-this.speed_coeff));
    //     //this.position.x = this.position.x - direction.x * this.speed_coeff;
    //     //this.position.z = this.position.z - direction.z * this.speed_coeff;
    //     break;
    //   }
    //   case "Space": {
    //     this.addBullet()
    //     ws.send(
    //       JSON.stringify({
    //         route: "fireBullet",
    //         content: this.avatar_username
    //       }))
    //     break;
    //   }
    //   case "ArrowRight": {
    //     this.rotate(Axis.Y, +0.5)
    //     break
    //   }
    //   case "ArrowLeft": {
    //     this.rotate(Axis.Y, -0.5)
    //     break
    //   }

    //   case "Enter": {
    //     makeInputVisible()
    //   }
    // }
    // if (event.key === "Enter" || (event.keyCode === 13) && (event.location === 3)) {
    //   makeInputVisible()
    // }
  }

  addBullet(displayOnly = false) {
    this.bulletList.push(new Bullet(this, displayOnly))
  }

  updateBulletPosition() {
    this.bulletList.forEach(e => e.update())
  }

  dispose(): void {
    super.dispose()
    this.usernamePanel.dispose()
  }
}

export function addAvatar(scene: Scene, avatar_username: string) {
  return new Avatar(scene, avatar_username, "")
}