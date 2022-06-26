import { Color3, Mesh, MeshBuilder, Ray, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { Health, MeshWithHealth } from "../meshWithHealth";
import { createLabel } from "../tools";
import { shadowGenerator } from "../scene";
import { ModelEnum } from "../models";

export class Avatar extends MeshWithHealth {
  sphere: Mesh;
  speed_coeff: number;
  didSomething: Boolean;
  oldPosition: Vector3;
  isJumping: boolean;
  canJump: boolean;
  timeJumping: number;
  lastShoot?: number;
  ray: Ray;
  jumpRay: Ray

  constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
    super(avatar_username, scene, p?.health);
    this.name = avatar_username
    let sphere = MeshBuilder.CreateCylinder(this.name + "sp1", { diameter: 0.5, height: 2 }, scene);
    let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene);

    this.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.checkCollisions = true;


    sphere.parent = this;
    this.addChild(sphere)
    this.addChild(queue)
    queue.position = new Vector3(0, 0, -0.3);
    this.sphere = sphere;

    this.speed_coeff = 0.20;
    this.didSomething = false;

    let plane = createLabel(this.name, this);
    this.addChild(plane)


    this.position = new Vector3(0, 1, 0);
    this.oldPosition = this.position.clone();


    this.ray = new Ray(this.position, new Vector3(0, -1, 0), 1.2);
    this.jumpRay = new Ray(this.position, new Vector3(0, 1, 0), 1.2);

    this.isJumping = false;
    this.canJump = true;
    this.timeJumping = 250;

    shadowGenerator?.addShadowCaster(this)
  }

  dispose(): void {
    super.dispose()
  }

}