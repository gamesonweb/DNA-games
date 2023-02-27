import { Mesh, Ray, Scene, Vector3 } from "babylonjs";
import { SceneSoft } from "../scene/sceneSoft";
import { MeshWithHealth } from "./meshWithHealth";
import { AVATAR_CLASSES } from "./classes/classesTypes";
import { renderTimeRatio } from "../main";
import { CharacterStatus } from "./classes/intrinsicProp";
import { intrinsicModelPropertiesD } from "./classes/models";

export abstract class AvatarSoft extends MeshWithHealth {
  speed_coeff: number;
  didSomething: Boolean;
  oldPosition: Vector3;
  isJumping: boolean;
  canJump: boolean;
  timeJumping: number;
  lastShoot?: number;
  ray: Ray;
  jumpRay: Ray;
  gravity_acceleration: number;
  canHit: boolean;
  canMove: boolean;
  canRotate: boolean;
  takeHits: boolean;
  model: Mesh | undefined;
  readonly class: AVATAR_CLASSES;
  offset_dir_y: number;
  protected status: CharacterStatus;
  falling_counter: number;

  // constructor(scene: Scene, avatar_username: string, p: intrinsicModelProperties) {
  constructor(scene: Scene, avatar_username: string, shape: Mesh, p: intrinsicModelPropertiesD) {
    // super(avatar_username, scene, createBasicShape(avatar_username, scene), p);
    super(avatar_username, scene, shape, p);

    this.gravity_acceleration = SceneSoft.gravityIntensity;
    this.name = avatar_username
    this.class = p.className as AVATAR_CLASSES

    this.speed_coeff = p.walkSpeed;
    this.didSomething = false;

    this.shape.position = new Vector3(0, 1, 0);
    this.oldPosition = this.shape.position.clone();
    this.offset_dir_y = 0;

    this.ray = new Ray(this.shape.position, new Vector3(0, -1, 0), 1.2);
    this.jumpRay = new Ray(this.shape.position, new Vector3(0, 1, 0), 1.2);

    this.isJumping = false;
    this.canJump = true;
    this.timeJumping = 250;

    this.canHit = true;
    this.canMove = true;
    this.canRotate = true;
    this.takeHits = true;

    this.status = "Idle"

    this.falling_counter = 20;
  }

  dispose(): void {
    super.dispose()
  }

  applyGravity(scale = 1) {
    // mesh.moveWithCollisions(new Vector3(0, -0.5, 0))
    var hits = this.shape.getScene().multiPickWithRay(this.ray, (m) => { return m.isPickable });

    var filtered = hits?.filter(e => (e.pickedMesh?.name !== this.shape?.name) && (e.pickedMesh?.name !== this.shape.getChildMeshes()[0].name))

    // console.log("filtered: ", filtered);
    // console.log("filtered: ");

    //if object detected but to high
    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[0]
      if (hit !== null && hit.pickedPoint && this.shape.position.y > hit.pickedPoint.y + 1.2) {
        this.shape.position.y += this.gravity_acceleration + SceneSoft.gravityIntensity * (scale - 1);
      } else {
        if (this.status === "Falling") {
          this.falling_counter = 20
          this.update_status("Idle")
        }
        this.gravity_acceleration = SceneSoft.gravityIntensity;
        this.canJump = true;
      }
      //else above the void
    } else {
      this.falling_counter--
      if (this.falling_counter <= 0 && this.getStatus() !== "TakingHit") this.update_status("Falling")
      this.shape.moveWithCollisions(new Vector3(0, this.gravity_acceleration * scale * renderTimeRatio, 0));
      // this.position.y += this.gravity_acceleration * 2;
      this.gravity_acceleration -= 0.009 * scale * renderTimeRatio;
    }
  }

  applyJump() {
    var hits = this.shape.getScene().multiPickWithRay(this.jumpRay, (m) => { return m.isPickable });

    var filtered = (hits?.filter(e => (this?.shape !== undefined) && e.pickedMesh?.name !== this?.shape.name))

    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[0]
      if (hit !== null && hit.pickedPoint && this.shape.position.y < hit.pickedPoint.y - 1.2) {
        this.shape.position.y -= SceneSoft.gravityIntensity
      }
    } else {
      this.shape.position.y -= SceneSoft.gravityIntensity * 10
    }
  }

  setRayPosition() {
    this.ray.origin = this.shape.position
  }

  knockback(direction: Vector3, power: number, cumulate = false) {
    if (this.canMove || cumulate) {
      console.log("call to knockback on ", this.name);
      direction.normalize()
      direction.y += 0.2
      direction.normalize()
      let scaledDirection = direction.scale(power / 2)
      // console.log("knockback direction: ", scaledDirection);
      this.canMove = false;
      this.canHit = false

      let intervalKnockBack = setInterval(() => {
        if (this && this.shape) this.shape.moveWithCollisions(scaledDirection.scale(renderTimeRatio))
      }, 100 / 6)
      setTimeout(() => { clearInterval(intervalKnockBack); if (this) { this.canMove = true; this.canHit = true } }, 150 * power)
    }
  }

  getStatus(): CharacterStatus {
    return this.status
  }

  update_status(new_status: CharacterStatus) {
    if (new_status !== this.status) {
      this.status = new_status
      this.didSomething = true
    }
    switch (new_status) {
      case "Running": this.speed_coeff = this.intrinsicModelProperties.runningSpeed; break;
      case "Walking_fw": this.speed_coeff = this.intrinsicModelProperties.walkSpeed; break;
      case "Walking_bw": this.speed_coeff = -this.intrinsicModelProperties.walkSpeed / 3; break;
    }
  }

  get_status_indice(status: CharacterStatus) {
    return this.intrinsicModelProperties.animations[status]
  }

  isInAir() {
    return this.getStatus() === "Falling" || this.getStatus() === "Jumping"
  }

  isMoving() {
    return this.getStatus() === "Running" || this.getStatus() === "Walking_bw" || this.getStatus() === "Walking_fw"
  }
}