import { Mesh, Ray, Scene, Vector3 } from "babylonjs";
import { intrinsicModelProperties } from "./classes/models";
import { SceneSoft } from "../scene/sceneSoft";
import { MeshWithHealth } from "./meshWithHealth";
import { AVATAR_CLASSES } from "./classes/classesTypes";
import { renderTimeRatio } from "../main";

export enum CharacterState {
  Idle,
  Walking_fw,
  Walking_bw,
  Running,
  Punching,
  Swimming,
  Jumping,
  Falling,
  Dying,
  TakingHit
}

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
  takeHits: boolean;
  model: Mesh | undefined;
  readonly class: AVATAR_CLASSES;
  offset_dir_y: number;
  protected status: CharacterState;
  falling_counter: number;

  // constructor(scene: Scene, avatar_username: string, p: intrinsicModelProperties) {
  constructor(scene: Scene, avatar_username: string, shape: Mesh, p: intrinsicModelProperties) {
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
    this.takeHits = true;

    this.status = CharacterState.Idle

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
        if (this.status === CharacterState.Falling) {
          this.falling_counter = 20
          this.update_status(CharacterState.Idle)
        }
        this.gravity_acceleration = SceneSoft.gravityIntensity;
        this.canJump = true;
      }
      //else above the void
    } else {
      this.falling_counter--
      if (this.falling_counter <= 0) this.update_status(CharacterState.Falling)
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

      let intervalKnockBack = setInterval(() => {
        if (this && this.shape) this.shape.moveWithCollisions(scaledDirection.scale(renderTimeRatio))
      }, 100 / 6)
      setTimeout(() => { clearInterval(intervalKnockBack); if (this) this.canMove = true }, 150 * power)
    }
  }

  getStatus(): CharacterState {
    return this.status
  }

  update_status(new_status: CharacterState) {
    switch (new_status) {
      case CharacterState.Running: this.speed_coeff = this.intrinsicModelProperties.runningSpeed; break;
      case CharacterState.Walking_fw: this.speed_coeff = this.intrinsicModelProperties.walkSpeed; break;
      case CharacterState.Walking_bw: this.speed_coeff = -this.intrinsicModelProperties.walkSpeed / 3; break;
    }
  }

  get_status_indice(status: CharacterState) {
    console.log("get_status_indice not implemented here");
  }

  isInAir() {
    return this.getStatus() === CharacterState.Falling || this.getStatus() === CharacterState.Jumping
  }

  isMoving() {
    return this.getStatus() === CharacterState.Running || this.getStatus() === CharacterState.Walking_bw || this.getStatus() === CharacterState.Walking_fw
  }
}