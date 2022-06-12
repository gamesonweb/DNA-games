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
    this.addChild(sphere)
    this.sphere = sphere;
  }

  move(evt: string) {
    switch (evt) {
      case "w": {
        this.position.z++;
        break;
      }
      case "s": {
        this.position.z--;
        break;
      }
      case "d": {
        this.position.x++;
        break;
      }
      case "a": {
        this.position.x--;
        break;
      }
    }
  }
}

export function addAvatar(scene: Scene) {
  return new Avatar(scene)
}