import { AbstractMesh, Axis, Mesh, Vector3 } from "babylonjs";
import { meshes } from "../../../connection/connectionClient";
import { scene, sphere1 } from "../../main";
import { distance, removeFromList } from "../../others/tools";
import { AvatarSoft } from "../avatarSoft";

export abstract class Projectile {
  myShooter: AvatarSoft;
  name: string;
  static id = 0;
  angle: Vector3;
  speedCoeff: number;
  displayOnly: Boolean;
  originalPositionBullet: Vector3;
  damage: number;
  range: number;
  shape: Mesh;

  constructor(myShooter: AvatarSoft, displayOnly: Boolean, damage: number, range: number, speed: number, model: Mesh | undefined, p: { position?: Vector3, direction?: Vector3 }) {

    //parameters
    this.displayOnly = displayOnly;
    this.myShooter = myShooter;
    this.damage = damage;
    this.range = range;
    this.speedCoeff = speed;

    //name
    this.name = "Bullet" + Projectile.id + myShooter.name;
    Projectile.id++;

    //shape
    this.shape = this.createShape()
    this.shape.checkCollisions = true;
    meshes.push(this.shape)

    //model
    if (model) this.shape.addChild(model)

    //direction projectile
    var directionShooter = myShooter.shape.getDirection(Axis.Z)
    var defaultAngle = this.myShooter == sphere1 ? new Vector3(directionShooter.x, scene.activeCamera!.getDirection(Axis.Z).y + 0.35, directionShooter.z) : directionShooter
    this.angle = p.direction || defaultAngle
    this.angle = this.angle.normalize()
    this.shape.rotation = this.angle

    //starting position projectile
    this.shape.position = p.position || this.myShooter.shape.position.clone().add(new Vector3(0, 0.8, 0));
    this.originalPositionBullet = this.shape.position.clone()
    this.shape.position.x = this.shape.position.x + this.angle.x * 3;
    this.shape.position.z = this.shape.position.z + this.angle.z * 3;

    //on collision effect
    this.shape.onCollide = e => {
      this.collide(e)
    }
  }

  abstract collide(mesh: AbstractMesh | undefined): void;

  abstract createShape(): Mesh

  update() {
    if (this.speedCoeff <= 0.02) {
      console.log("DEBUG: projectile ", this.name, " is too slow (", this.speedCoeff, "), is disposed.");
      this.dispose();
    }
    this.shape.moveWithCollisions(this.angle.scale(this.speedCoeff))
    if (distance(this.shape.position, this.originalPositionBullet) > this.range) {
      this.dispose()
    }
  }

  dispose(): void {
    removeFromList(this, scene.projectileList)
    removeFromList(this.shape, meshes)
    this.shape.dispose()
  }
}