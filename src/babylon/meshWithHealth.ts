import { Color3, DynamicTexture, Mesh, MeshBuilder, Nullable, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { scene } from "./main";

export type Health = {
  maxHealth?: number;
  minHealth?: number;
  currentHealth?: number;
}

export class MeshWithHealth extends Mesh implements Health {
  maxHealth: number;
  minHealth: number;
  currentHealth: number;
  healthBar: HealthBar;


  constructor(name: string, scene?: Nullable<Scene> | undefined, healthParam?: Health) {
    super(name, scene);
    this.maxHealth = healthParam?.maxHealth || 100
    this.minHealth = healthParam?.minHealth || 0
    this.currentHealth = healthParam?.currentHealth || this.maxHealth;
    this.healthBar = new HealthBar(this);
  }

  healthSetToMax() {
    this.healthSet(this.maxHealth);
  }

  healthAdd(n: number) {
    this.healthSet(this.currentHealth + n)
  }

  healthMinus(n: number) {
    this.healthSet(this.currentHealth - n)
  }

  healthKill() {
    this.healthSet(this.minHealth)
  }

  healthSet(newHealth: number | undefined) {
    this.currentHealth = Math.min(this.maxHealth, Math.max(this.minHealth, newHealth || this.currentHealth))
    this.healthBar.updateHealthBar(this.healthPercentage())
  }

  healthPercentage() {
    return this.currentHealth / this.maxHealth;
  }
}

class HealthBar {

  static colorHealthHigh = Color3.Green()
  static colorHealthMedium = new Color3(0.5, 0.5, 0)
  static colorHealthLow = new Color3(1, 0, 0)
  healthBar: Mesh | undefined;
  healthBarMaterial: StandardMaterial | undefined;
  height: number;
  width: number;

  constructor(parent: Mesh, p?: { height: number, width: number }) {
    this.height = p?.height || 0.15;
    this.width = p?.width || 1;
    let [width, height] = [this.width, this.height]
    // the healthBarContainer
    var healthBarContainerMaterial = new StandardMaterial(parent.name + "hb2mat", scene);
    healthBarContainerMaterial.emissiveColor = Color3.White();
    healthBarContainerMaterial.backFaceCulling = false;

    var healthBarContainer = MeshBuilder.CreatePlane(parent.name + "hb2", { width, height }, scene);
    healthBarContainer.position = new Vector3(0, 1.2, 0);     // Position above player.
    healthBarContainer.parent = parent;
    healthBarContainer.material = healthBarContainerMaterial;
    healthBarContainer.billboardMode = Mesh.BILLBOARDMODE_Y

    // The healthBar
    var healthBar = MeshBuilder.CreatePlane(parent.name + "hb1", { width, height }, scene);
    healthBar.position = new Vector3(0, 0, -.01);
    var healthBarMaterial = new StandardMaterial(parent.name + "hb1mat", scene);
    healthBarMaterial.backFaceCulling = false;
    healthBarMaterial.emissiveColor = HealthBar.colorHealthHigh;
    var dynamicTexture = new DynamicTexture(parent.name + "dt1", 512, scene, true);
    dynamicTexture.hasAlpha = true;
    healthBar.parent = healthBarContainer;
    healthBar.material = healthBarMaterial;

    this.healthBar = healthBar;
    this.healthBarMaterial = healthBarMaterial
  }

  updateHealthBar(healthPercentage: number) {
    if (this.healthBar === undefined) return
    this.healthBar.scaling.x = healthPercentage;
    this.healthBar.position.x = -(this.width * (1 - healthPercentage) / 2);

    if (healthPercentage > 2 / 3) {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthHigh;
    } else if (healthPercentage < 2 / 3 && healthPercentage > 1 / 3) {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthMedium
    } else {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthLow
    }

  }
}