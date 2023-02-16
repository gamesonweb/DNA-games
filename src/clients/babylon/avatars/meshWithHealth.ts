import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";

export type Health = {
  maxHealth?: number;
  minHealth?: number;
  currentHealth?: number;
}

export abstract class MeshWithHealth implements Health {
  maxHealth: number;
  minHealth: number;
  currentHealth: number;
  healthBar: HealthBar;
  name: string;
  shape: Mesh;


  constructor(name: string, scene: Scene, shape: Mesh, healthParam: number) {
    this.name = name;
    this.shape = shape;
    // this.shape.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.shape.checkCollisions = true;
    this.shape.showBoundingBox = true;
    this.maxHealth = healthParam
    this.minHealth = 0
    this.healthBar = new HealthBar(this.shape, scene);
    this.currentHealth = this.healthSet(this.maxHealth)
  }

  dispose() {
    this.shape.dispose();
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
    return this.currentHealth;
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

  constructor(parent: Mesh, scene: Scene, p?: { height: number, width: number }) {
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
    healthBarContainer.isPickable = false

    // The healthBar
    var healthBar = MeshBuilder.CreatePlane(parent.name + "hb1", { width, height }, scene);
    healthBar.position = new Vector3(0, 0, -.01);
    var healthBarMaterial = new StandardMaterial(parent.name + "hb1mat", scene);
    healthBarMaterial.backFaceCulling = false;
    healthBarMaterial.emissiveColor = HealthBar.colorHealthHigh;
    healthBarMaterial.diffuseColor = Color3.Black()
    healthBarMaterial.specularColor = Color3.Black()
    healthBarMaterial.ambientColor = Color3.Black()
    healthBar.parent = healthBarContainer;
    healthBar.material = healthBarMaterial;
    healthBar.isPickable = false;

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