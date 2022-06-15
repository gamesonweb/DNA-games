import { Axis, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { Avatar } from "./avatar";
import { meshes } from "./connectionWS";
import { distance, removeFromList } from "./tools";

export class Bullet extends Mesh {
  myShooter: Avatar;
  name: string;
  static id = 0;
  angle: Vector3;
  speedCoeff: number;

  constructor(myShooter: Avatar) {
    super("Bullet" + Bullet.id + myShooter.name);
    this.name = "Bullet" + Bullet.id + myShooter.name;

    this.myShooter = myShooter;
    this.addChild(this.createSphere())
    this.angle = myShooter.getDirection(Axis.X)
    this.position = this.myShooter.position.clone();
    this.speedCoeff = 0.05;
    meshes.push(this)
    Bullet.id++;
  }

  createSphere() {
    return MeshBuilder.CreateSphere(this.name + "model", {
      diameter: 0.5,
      segments: 16
    });
  }

  update() {
    if (this.speedCoeff < 0) return
    // NOE !
    let x = this.position.x + Math.sin(this.angle.x) * this.speedCoeff;
    let z = this.position.z + Math.cos(this.angle.z) * this.speedCoeff;
    this.position.x = x;
    this.position.z = z;
    if (distance(this.position, this.myShooter.position) > 10) {
      this.dispose()
    }
  }

  dispose(): void {
    super.dispose()
    removeFromList(this, this.myShooter.bulletList)
    removeFromList(this, meshes)
  }
}