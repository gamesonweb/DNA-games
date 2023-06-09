import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { intrinsicModelProperties } from "./classes/intrinsicProp";
import { intrinsicModelPropertiesD } from "./classes/models";

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
  intrinsicModelProperties: intrinsicModelPropertiesD;


  constructor(name: string, scene: Scene, shape: Mesh, p: intrinsicModelPropertiesD) {
    this.name = name;
    this.intrinsicModelProperties = p;
    this.shape = shape;
    this.shape.name = this.name
    // this.shape.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.shape.checkCollisions = true;
    this.shape.showBoundingBox = true;
    this.maxHealth = p.health
    this.minHealth = 0
    this.healthBar = new HealthBar(this.shape, scene, p);
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
    if (newHealth === undefined) newHealth = this.currentHealth
    this.currentHealth = Math.min(this.maxHealth, Math.max(this.minHealth, newHealth))
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
  healthbar_height: number;
  healthbar_width: number;

  constructor(parent: Mesh, scene: Scene, p: intrinsicModelProperties) {
    this.height = p.height;
    this.width = p.width;
    this.healthbar_height = 0.15;
    this.healthbar_width = 1;
    // the healthBarContainer
    var healthBarContainerMaterial = new StandardMaterial(parent.name + "hb2mat", scene);
    healthBarContainerMaterial.emissiveColor = Color3.White();
    healthBarContainerMaterial.backFaceCulling = false;

    var healthBarContainer = MeshBuilder.CreatePlane(parent.name + "hb2", { width: this.healthbar_width, height: this.healthbar_height }, scene);
    healthBarContainer.position = new Vector3(0, p?.healthYAbove || 1.2, 0);     // Position above player.
    healthBarContainer.parent = parent;
    healthBarContainer.material = healthBarContainerMaterial;
    healthBarContainer.billboardMode = Mesh.BILLBOARDMODE_Y
    healthBarContainer.isPickable = false

    // The healthBar
    var healthBar = MeshBuilder.CreatePlane(parent.name + "hb1", { width: this.healthbar_width, height: this.healthbar_height }, scene);
    healthBar.position = new Vector3(0, 0, -0.01);
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
    this.healthBar.position.x = -(this.healthbar_width * (1 - healthPercentage) / 2);

    if (healthPercentage > 2 / 3) {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthHigh;
    } else if (healthPercentage < 2 / 3 && healthPercentage > 1 / 3) {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthMedium
    } else {
      this.healthBarMaterial!.emissiveColor = HealthBar.colorHealthLow
    }

  }
}