import { Mesh, Scene, } from "babylonjs";
import { shadowGeneratorCampfire } from "../others/models";
import { createLabel } from "../others/tools";
import { shadowGenerator } from "../scene/sceneClient";
import { AvatarSoft } from "./avatarSoft";

export abstract class Avatar extends AvatarSoft {
  tableAttackcd: number[];
  tableAttackDate: number[];
  weightCategory: number;

  constructor(scene: Scene, avatar_username: string, shape: Mesh, model: Mesh, health: number, speed: number) {

    super(scene, avatar_username, shape, health, speed);

    let plane = createLabel(this.name, this, scene);
    plane.isPickable = false;
    this.shape.addChild(plane)

    this.shape.addChild(model);
    shadowGenerator?.addShadowCaster(model);
    this.shape.isVisible = false;
    this.model = model;

    shadowGeneratorCampfire.addShadowCaster(this.model);

    //initialize date of last instance for each attack type
    this.tableAttackDate = [0, 0, 0, 0]

    //default attack cd, will be overrided for all usable attack
    this.tableAttackcd = [0, 1000, 1000, 1000]

    this.weightCategory = 1
  }

  dispose(): void {
    super.dispose()
  }

  hit(hitmode_id: number, onlyDisplay = false) {
    if (!this.attackIsReady(hitmode_id) || this.canHit == false) return
    switch (hitmode_id) {
      case 0:
        this.attack_0(onlyDisplay)
        break
      case 1:
        this.attack_1(onlyDisplay)
        break
      case 2:
        this.attack_2(onlyDisplay)
        break
      case 3:
        this.attack_3(onlyDisplay)
        break
      default:
        console.log("ERROR: tried to call hit(", hitmode_id, ") on avatar ", this);

    }
  }

  attackIsReady(id: number) {
    if (!this.tableAttackDate[id] || this.tableAttackDate[id] + this.tableAttackcd[id] < Date.now()) {
      this.tableAttackDate[id] = Date.now()
      return true
    }
    return false
  }

  attack_0(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_0 on avatar ", this);
  }
  attack_1(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_1 on avatar ", this);
  }
  attack_2(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_2 on avatar ", this);
  }
  attack_3(onlyDisplay = false) {
    console.log("ERROR: tried to call non-implemented attack_3 on avatar ", this);
  }

  abstract take_damage(source: Mesh, amount: number, knockback_power: number): void

}