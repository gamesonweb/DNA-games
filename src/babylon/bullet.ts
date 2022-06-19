import { Axis, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { Avatar } from "./avatar";
import { meshes, night_monster_list, serverMessages, ws } from "./connectionWS";
import { scene, sphere1 } from "./main";
import { distance, removeFromList } from "./tools";

export class Bullet extends Mesh {
  myShooter: Avatar;
  name: string;
  static id = 0;
  angle: Vector3;
  speedCoeff: number;
  displayOnly: Boolean;
  originalPositionBullet: Vector3;
  damage: number;

  constructor(myShooter: Avatar, displayOnly: Boolean) {
    super("Bullet" + Bullet.id + myShooter.name);
    this.name = "Bullet" + Bullet.id + myShooter.name;
    this.displayOnly = displayOnly;
    this.myShooter = myShooter;
    this.addChild(this.createSphere())
    this.angle = myShooter.getDirection(Axis.Z)
    this.position = this.myShooter.position.clone();
    this.originalPositionBullet = this.position.clone()
    this.speedCoeff = 0.05;
    this.rotation = this.angle
    meshes.push(this)
    this.position.x = this.position.x + this.angle.x * 3;
    this.position.z = this.position.z + this.angle.z * 3;
    this.checkCollisions = true;
    this.damage = 10;
    Bullet.id++;

    this.onCollide = e => {
      if (e?.parent instanceof Avatar) {
        let avatar = e.parent as Avatar;
        if (avatar.name.includes("zombie") && this.myShooter.name === sphere1!.name) {
          console.log("HERE");
          console.log(night_monster_list);

          ws.send(
            JSON.stringify({
              route: serverMessages.DAMAGE_MONSTER,
              content: JSON.stringify({ username: avatar.name, damage: this.damage })
            }))
        }
      }
      this.dispose()
    }
  }

  createSphere(): Mesh {
    let sphere = MeshBuilder.CreateSphere(this.name + "model", {
      diameter: 0.5,
      segments: 16
    }, scene);
    return sphere
  }

  update() {
    if (this.speedCoeff <= 0.02) this.dispose();
    this.moveWithCollisions(this.angle.scale(this.speedCoeff))
    // this.position.x = this.position.x + this.angle.x * this.speedCoeff;
    // this.position.z = this.position.z + this.angle.z * this.speedCoeff;
    if (distance(this.position, this.originalPositionBullet) > 15) {
      this.dispose()
    }
  }

  dispose(): void {
    super.dispose()
    removeFromList(this, this.myShooter.bulletList)
    removeFromList(this, meshes)
  }
}