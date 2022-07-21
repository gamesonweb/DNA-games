import { Mesh, Ray, Scene, Vector3 } from "babylonjs";
import { SceneSoft } from "../scene/sceneSoft";
import { Health, MeshWithHealth } from "./meshWithHealth";

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


  constructor(scene: Scene, avatar_username: string, shape: Mesh, p?: { bulletDelay?: number, health?: Health }) {
    super(avatar_username, scene, shape, p?.health);

    this.gravity_acceleration = 0;
    this.name = avatar_username

    // sphere.parent = this;
    // this.addChild(sphere)
    // this.addChild(queue)
    // queue.position = new Vector3(0, 0, -0.3);
    // this.sphere = sphere;

    this.speed_coeff = 0.20;
    this.didSomething = false;

    this.shape.position = new Vector3(0, 1, 0);
    this.oldPosition = this.shape.position.clone();


    this.ray = new Ray(this.shape.position, new Vector3(0, -1, 0), 1.2);
    this.jumpRay = new Ray(this.shape.position, new Vector3(0, 1, 0), 1.2);

    this.isJumping = false;
    this.canJump = true;
    this.timeJumping = 250;
  }

  dispose(): void {
    super.dispose()
  }

  applyGravity() {
    // mesh.moveWithCollisions(new Vector3(0, -0.5, 0))
    var hits = this.shape.getScene().multiPickWithRay(this.ray, (m) => { return m.isPickable });

    var filtered = hits?.filter(e => e.pickedMesh?.name !== this.shape?.name)
    // console.log("filtered: ", filtered);

    //if object detected but to high
    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[0]
      if (hit !== null && hit.pickedPoint && this.shape.position.y > hit.pickedPoint.y + 1.2) {
        this.shape.position.y += this.gravity_acceleration;
      } else {
        this.gravity_acceleration = SceneSoft.gravityIntensity;
        this.canJump = true;
      }
      //else above the void
    } else {
      this.shape.moveWithCollisions(new Vector3(0, this.gravity_acceleration * 2, 0));
      // this.position.y += this.gravity_acceleration * 2;
      this.gravity_acceleration += SceneSoft.gravityIntensity * 0.2;
    }
  }

  applyJump() {
    var hits = this.shape.getScene().multiPickWithRay(this.jumpRay, (m) => { return m.isPickable });

    var filtered = (hits?.filter(e => (this?.shape != undefined) && e.pickedMesh?.name !== this?.shape.name))

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
}