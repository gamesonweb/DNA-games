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
  displayOnly: Boolean;

  constructor(myShooter: Avatar, displayOnly: Boolean) {
    super("Bullet" + Bullet.id + myShooter.name);
    this.name = "Bullet" + Bullet.id + myShooter.name;
    this.displayOnly = displayOnly;

    this.myShooter = myShooter;
    this.addChild(this.createSphere())
    this.angle = myShooter.getDirection(Axis.Z)
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
    if (this.speedCoeff <= 0.02) this.dispose();
    this.position.x = this.position.x + this.angle.x * this.speedCoeff;
    this.position.z = this.position.z + this.angle.z * this.speedCoeff;
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