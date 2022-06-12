import { Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;

  constructor(scene: Scene) {
    super("Avatar" + Avatar.counter, scene);
    this.counter = Avatar.counter;
    Avatar.counter++;
    this.position = new Vector3(this.counter, 1, 0);
    let sphere = MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
    sphere.parent = this;
    sphere.position = new Vector3(this.counter, 1, 0);
    this.addChild(sphere)
    this.sphere = sphere;
  }
}

export function addAvatar(scene: Scene) {
  return new Avatar(scene)
}