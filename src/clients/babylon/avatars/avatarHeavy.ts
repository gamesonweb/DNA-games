import { Mesh, Scene, } from "babylonjs";
import { createLabel } from "../others/tools";
import { shadowGenerator } from "../scene/sceneClient";
import { AvatarSoft } from "./avatarSoft";
import { Health } from "./meshWithHealth";

export abstract class Avatar extends AvatarSoft {

  constructor(scene: Scene, avatar_username: string, shape: Mesh, p?: { bulletDelay?: number, health?: Health }) {

    super(scene, avatar_username, shape, p);

    let plane = createLabel(this.name, this, scene);
    this.shape.addChild(plane)

    shadowGenerator?.addShadowCaster(this.shape)
  }

  dispose(): void {
    super.dispose()
  }

}