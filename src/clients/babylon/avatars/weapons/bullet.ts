import { Axis, Mesh, MeshBuilder, Vector3 } from "babylonjs";
import { meshes, wsClient } from "../../../connection/connectionClient";
import { serverMessages } from "../../../connection/connectionSoft";
import { scene, sphere1 } from "../../main";
import { distance, getAvatarByShape, removeFromList } from "../../others/tools";
import { Player } from "../heroes/player";

export class Bullet extends Mesh {
  myShooter: Player;
  name: string;
  static id = 0;
  angle: Vector3;
  speedCoeff: number;
  displayOnly: Boolean;
  originalPositionBullet: Vector3;
  damage: number;

  constructor(myShooter: Player, displayOnly: Boolean, p?: { damage?: number }) {
    super("Bullet" + Bullet.id + myShooter.name);
    this.name = "Bullet" + Bullet.id + myShooter.name;
    this.displayOnly = displayOnly;
    this.myShooter = myShooter;
    this.addChild(this.createSphere())
    this.angle = myShooter.shape.getDirection(Axis.Z)
    this.position = this.myShooter.shape.position.clone();
    this.originalPositionBullet = this.position.clone()
    this.speedCoeff = 0.20;
    this.rotation = this.angle
    meshes.push(this)
    this.position.x = this.position.x + this.angle.x * 3;
    this.position.z = this.position.z + this.angle.z * 3;
    this.checkCollisions = true;
    this.damage = p?.damage || 40;
    Bullet.id++;

    this.onCollide = e => {
      if (e && !this.displayOnly) {
        var monster = getAvatarByShape(e, [wsClient.night_monster_list])
        if (monster) {
          monster.take_damage(this, this.damage)
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
    if (distance(this.position, this.originalPositionBullet) > 15) {
      this.dispose()
    }
  }

  dispose(): void {
    removeFromList(this, scene.bulletList)
    removeFromList(this, meshes)
    super.dispose()
  }
}