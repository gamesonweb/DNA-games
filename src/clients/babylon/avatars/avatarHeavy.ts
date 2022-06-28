import { Color3, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { windowExists } from "../../reactComponents/tools";
import { ModelEnum } from "../others/models";
import { createLabel } from "../others/tools";
import { shadowGenerator } from "../scene/sceneClient";
import { AvatarSoft } from "./avatarSoft";
import { Health } from "./meshWithHealth";

export class Avatar extends AvatarSoft {

  constructor(scene: Scene, avatar_username: string, username: string, p?: { bulletDelay?: number, health?: Health }) {
    super(scene, avatar_username, p);

    let model;
    if (windowExists() && this.name.includes("zombie") && ModelEnum.PumpkinMonster.rootMesh != undefined) {
      model = ModelEnum.PumpkinMonster.rootMesh?.clone();

    } else {
      if (this.name.includes("zombie")) {
        console.log("TODO: Create zombie only after the import of model is finished OR change dynamically the shape when loading done")
      }
      model = MeshBuilder.CreateCylinder(this.name + "sp1", { diameter: 0.5, height: 2 }, scene);
      let queue = MeshBuilder.CreateSphere(this.name + "sp2", { segments: 16, diameter: 0.3 }, scene);

      if (avatar_username !== username) {
        model.checkCollisions = true;
      }
      var myMaterial = new StandardMaterial("myMaterial", scene);

      myMaterial.diffuseColor = new Color3(0.3, 0.5, 1);
      model.material = myMaterial;
      model.parent = this;
      model.addChild(queue)
      queue.position = new Vector3(0, 0, -0.3);
    }

    this.addChild(model);
    this.shape = model;

    let plane = createLabel(this.name, this, scene);
    this.addChild(plane)

    shadowGenerator?.addShadowCaster(this)
  }

  dispose(): void {
    super.dispose()
  }

}