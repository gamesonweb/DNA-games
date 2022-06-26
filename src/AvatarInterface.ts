import { Mesh, Ray } from "babylonjs";

export interface AvaterInterface extends Mesh {
  ray: Ray;
  shape: undefined | Mesh;
  canJump: boolean;
}