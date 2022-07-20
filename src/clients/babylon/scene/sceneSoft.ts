import { Mesh, AssetsManager, Engine, FreeCamera, GroundMesh, Scene, Vector3 } from "babylonjs";

export const groundParameters = {
  width: 100,
  height: 100,
  minHeight: -1,
  maxHeight: 2,
  subdivisions: 32
}

export abstract class SceneSoft extends Scene {
  static gravityIntensity = -0.02;
  ground: Mesh | undefined;
  assetManager: AssetsManager | undefined;

  constructor(engine: Engine) {
    // This creates a basic Babylon Scene object (non-mesh)
    super(engine)
    console.log("Creating scene soft")
    this.collisionsEnabled = true;
    this.createCamera()

    this.assetManager = this.configureAssetManager();
    this.createGround()
  }

  configureAssetManager(): undefined | AssetsManager {
    return
  }

  createCamera() {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 10, -10), this);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());
  }

  abstract createGround(): void;
};