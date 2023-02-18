import { InstantiatedEntries, Mesh, Scene, Vector3, } from "babylonjs";
import { intrinsicModelProperties, shadowGeneratorCampfire } from "../others/models";
import { createBasicShape, createLabel } from "../others/tools";
import { shadowGenerator } from "../scene/sceneClient";
import { AvatarSoft } from "./avatarSoft";

export abstract class Avatar extends AvatarSoft {
  modelContainer: InstantiatedEntries
  model: Mesh

  tableAttackcd: number[];
  tableAttackDate: number[];
  weightCategory: number;
  statusStacks: { burn: number; poison: number; bleed: number; };

  constructor(scene: Scene, avatar_username: string, p: intrinsicModelProperties) {

    let shape = createBasicShape(avatar_username, scene);
    var modelContainer = p.duplicateModel();
    super(scene, avatar_username, shape, p);

    this.modelContainer = modelContainer
    this.model = modelContainer.rootNodes[0] as Mesh

    let plane = createLabel(this.name, this, scene, p);
    plane.isPickable = false;
    this.shape.addChild(plane)

    plane.position.y = p?.textYAbove || 1.3

    this.shape.addChild(this.model);
    shadowGenerator?.addShadowCaster(this.model);
    this.shape.isVisible = false;

    shadowGeneratorCampfire.addShadowCaster(this.model);

    //initialize date of last instance for each attack type
    this.tableAttackDate = [0, 0, 0, 0]

    //default attack cd, will be overrided for all usable attack
    this.tableAttackcd = [0, 1000, 1000, 1000]

    this.weightCategory = 1

    this.statusStacks = { burn: 0, poison: 0, bleed: 0 }
  }

  dispose(): void {
    super.dispose()
  }

  hit(hitmode_id: number, onlyDisplay = false) {
    if (!this.attackIsReady(hitmode_id) || this.canHit === false) return
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

  abstract take_damage(source: Vector3, amount: number, knockback_power: number): void

  triggerStatus(statut: string) {
    switch (statut) {

      //burn, large damage over short period, does not cumulate
      case "burn":
        if (this.statusStacks.burn >= 1) return
        this.statusStacks.burn++
        var burningDamage = setInterval(() => {
          if (this) this.take_damage(this.shape.position, 10, 0)
        }, 500)
        setTimeout(() => {
          this.statusStacks.burn--
          clearInterval(burningDamage)
        }, 2000)
        break;

      //poison, small damage over long period, does cumulate
      case "poisoned":
        this.statusStacks.poison++
        var poisoningDamage = setInterval(() => {
          if (this) this.take_damage(this.shape.position, 5, 0)
        }, 500)
        setTimeout(() => {
          this.statusStacks.poison--
          clearInterval(poisoningDamage)
        }, 10000)
        break;

      //bleed, large damage over long period, does not cumulate
      case "bleed":
        if (this.statusStacks.bleed >= 1) {
          console.log("bleed already applied");
          return
        }
        this.statusStacks.bleed++
        console.log("applying bleed, stack now ", this.statusStacks.bleed);
        var bleedingDamage = setInterval(() => {
          if (this) this.take_damage(this.shape.position, 5, 0)
        }, 200)
        setTimeout(() => {
          this.statusStacks.bleed--
          clearInterval(bleedingDamage)
        }, 6000)
        break;

      default:
        console.log(statut, " effect does not exist");
    }
  }

}