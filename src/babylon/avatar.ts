import { Axis, Color3, Mesh, MeshBuilder, Quaternion, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { Bullet } from "./bullet";
import { serverMessages, ws } from "./connectionWS";
import { inputStates } from "./inputListeners";
import { MeshWithHealth } from "./meshWithHealth";
import { createLabel } from "./tools";

export class Avatar extends MeshWithHealth {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: string;
  bulletList: Bullet[];
  speed_coeff: number;
  didSomething: Boolean;
  oldPosition: Vector3;
  isJumping: boolean;
  canJump: boolean;
  timeJumping: number;
  bulletDelay: number;
  lastShoot?: number;


  constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay: number }) {
    super(avatar_username + Avatar.counter, scene);
    this.name = avatar_username + Avatar.counter
    this.counter = Avatar.counter;
    Avatar.counter += 3;
    let sphere = MeshBuilder.CreateCylinder(this.name + "sp1", { diameter: 0.5, height: 2 }, scene);
    let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene);

    this.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.checkCollisions = true;
    if (avatar_username !== username) {
      sphere.checkCollisions = true;
    }
    var myMaterial = new StandardMaterial("myMaterial", scene);

    myMaterial.diffuseColor = new Color3(0.3, 0.5, 1);
    sphere.material = myMaterial;

    sphere.parent = this;
    this.addChild(sphere)
    this.addChild(queue)
    queue.position = new Vector3(0, 0, -0.3);
    this.sphere = sphere;
    this.bulletList = [];
    this.speed_coeff = 0.20;
    this.didSomething = false;

    this.avatar_username = avatar_username;

    // let plane = createTextOnPlane(this.avatar_username, scene)
    // this.addChild(plane)
    let plane = createLabel(this.avatar_username, this);
    this.addChild(plane)


    this.position = new Vector3(this.counter, 2, 0);
    this.oldPosition = this.position.clone();

    this.isJumping = false;
    this.canJump = true;
    this.timeJumping = 500;
    this.bulletDelay = p?.bulletDelay || 500;
  }

  move() {

    if (inputStates.goRight || inputStates.goLeft || inputStates.goBackward || inputStates.goForeward || inputStates.rotateRight || inputStates.rotateLeft)
      this.didSomething = true;

    let direction = this.getDirection(Axis.Z)

    let coeff_diagonal = 1
    if ((inputStates.goForeward || inputStates.goBackward) && (inputStates.goLeft || inputStates.goRight)) coeff_diagonal = Math.PI / 4;

    //forward/backward movement
    if (inputStates.goForeward) {
      this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal));
    } else if (inputStates.goBackward) {
      this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 2));
    }

    //left/right movement
    if (inputStates.goLeft) {
      direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
      this.moveWithCollisions(direction.scale(-this.speed_coeff * coeff_diagonal / 1.5));
    } else if (inputStates.goRight) {
      direction = direction.applyRotationQuaternion(Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(90), 0));
      this.moveWithCollisions(direction.scale(this.speed_coeff * coeff_diagonal / 1.5));
    }

    //Rotation
    if (inputStates.rotateRight) {
      this.rotate(Axis.Y, +0.05)
    } else if (inputStates.rotateLeft) {
      this.rotate(Axis.Y, -0.05)
    }

    //add bullet -will become jump later => jump on space and attack on leftMouseClick
    if (inputStates.space) {
      // if (this.canJump) {
      //   this.isJumping = true;
      //   this.canJump = false
      //   setTimeout(() => {
      //     this.isJumping = false
      //   }, this.timeJumping / 2.5)
      //   setTimeout(() => {
      //     this.canJump = true
      //   }, this.timeJumping)
      // }

      this.addBullet()
      ws.send(
        JSON.stringify({
          route: serverMessages.FIRE_BULLET,
          content: this.avatar_username
        }))

    }
  }

  addBullet(displayOnly = false) {
    if (this.lastShoot === undefined || this.lastShoot + this.bulletDelay < Date.now()) {
      this.lastShoot = Date.now()
      this.bulletList.push(new Bullet(this, displayOnly))
    }
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