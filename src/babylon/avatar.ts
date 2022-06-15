import { FollowCamera, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";

export class Avatar extends Mesh {
  static counter = 0;
  counter: number;
  sphere: Mesh;
  avatar_username: String;
  cameraAvatar: FollowCamera;

  constructor(scene: Scene, avatar_username: String) {
    super("Avatar" + Avatar.counter, scene);
    this.name = "Avatar" + Avatar.counter
    this.counter = Avatar.counter;
    Avatar.counter++;
    this.position = new Vector3(this.counter, 1, 0);
    let sphere = MeshBuilder.CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene);
    sphere.parent = this;
    this.addChild(sphere)
    this.sphere = sphere;

    this.avatar_username = avatar_username;
    this.cameraAvatar = new FollowCamera(this.name + "Camera", this.position.multiply(new Vector3(1, -1, 1)), scene, this);
    this.cameraAvatar.rotationOffset = 180;
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

  dispose(doNotRecurse?: boolean | undefined, disposeMaterialAndTextures?: boolean | undefined): void {
    super.dispose(doNotRecurse, disposeMaterialAndTextures)
    this.cameraAvatar.dispose()
  }
}

export function addAvatar(scene: Scene, avatar_username: String) {
  return new Avatar(scene, avatar_username)
}