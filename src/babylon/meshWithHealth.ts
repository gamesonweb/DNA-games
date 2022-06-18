import { Mesh, Nullable, Scene } from "babylonjs";

type Health = {
  maxHealth?: number;
  minHealth?: number;
  currentHealt?: number;
}

export class MeshWithHealth extends Mesh implements Health {
  maxHealth: number;
  minHealth: number;
  currentHealt: number;


  constructor(name: string, scene?: Nullable<Scene> | undefined, healthParam?: Health) {
    super(name, scene);
    this.maxHealth = healthParam?.maxHealth || 100
    this.minHealth = healthParam?.minHealth || 0
    this.currentHealt = healthParam?.currentHealt || 100
  }

  /** this.currentHealt = this.maxHealth; */
  healthSetToMax() {
    this.currentHealt = this.maxHealth;
  }

  healthAdd(n: number) {
    this.currentHealt = Math.max(this.minHealth, this.currentHealt - n)
  }

  healthMinus(n: number) {
    this.currentHealt = Math.min(this.maxHealth, this.currentHealt + n)
  }

  healthKill() {
    this.currentHealt = this.minHealth;
  }
}