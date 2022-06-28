import { Mesh, Ray, Scene, Vector3 } from "babylonjs";
import { SceneSoft } from "../scene/sceneSoft";
import { Health, MeshWithHealth } from "./meshWithHealth";

export class AvatarSoft extends MeshWithHealth {
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
  shape: undefined | Mesh;


  constructor(scene: Scene, avatar_username: string, p?: { bulletDelay?: number, health?: Health }) {
    super(avatar_username, scene, p?.health);

    this.gravity_acceleration = 0;
    this.name = avatar_username

    this.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.checkCollisions = true;

    // sphere.parent = this;
    // this.addChild(sphere)
    // this.addChild(queue)
    // queue.position = new Vector3(0, 0, -0.3);
    // this.sphere = sphere;

    this.speed_coeff = 0.20;
    this.didSomething = false;

    this.position = new Vector3(0, 1, 0);
    this.oldPosition = this.position.clone();


    this.ray = new Ray(this.position, new Vector3(0, -1, 0), 1.2);
    this.jumpRay = new Ray(this.position, new Vector3(0, 1, 0), 1.2);

    this.isJumping = false;
    this.canJump = true;
    this.timeJumping = 250;
  }

  dispose(): void {
    super.dispose()
  }

  applyGravity() {
    // mesh.moveWithCollisions(new Vector3(0, -0.5, 0))
    var hits = this.getScene().multiPickWithRay(this.ray, (m) => { return m.isPickable });

    var filtered = hits?.filter(e => e.pickedMesh?.name !== this.shape?.name)

    //if object detected but to high
    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[0]
      if (hit !== null && hit.pickedPoint && this.position.y > hit.pickedPoint.y + 1.2) {
        this.position.y += this.gravity_acceleration;
      } else {
        this.gravity_acceleration = SceneSoft.gravityIntensity;
        this.canJump = true;
      }
      //else above the void
    } else {
      this.position.y += this.gravity_acceleration * 2;
      this.gravity_acceleration += SceneSoft.gravityIntensity * 0.2;
    }
  }

  applyJump() {
    var hits = this.getScene().multiPickWithRay(this.jumpRay, (m) => { return m.isPickable });

    var filtered = (hits?.filter(e => (this?.shape != undefined) && e.pickedMesh?.name !== this?.shape.name))

    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[0]
      if (hit !== null && hit.pickedPoint && this.position.y < hit.pickedPoint.y - 1.2) {
        this.position.y -= SceneSoft.gravityIntensity
      }
    } else {
      this.position.y -= SceneSoft.gravityIntensity * 10
    }
  }
}