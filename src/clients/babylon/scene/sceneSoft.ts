import { AssetsManager, Engine, FreeCamera, Scene, Vector3, Ray } from "babylonjs";

export const groundParameters = {
  width: 100,
  height: 100,
  minHeight: -1,
  maxHeight: 2,
  subdivisions: 32
}

export abstract class SceneSoft extends Scene {
  static gravityIntensity = -0.02;
  grounds: string[];
  //assetManager: AssetsManager | undefined;
  heightRay: Ray;
  groundsData: { modelID: string; meshName: string; position: Vector3; }[];
  treePositions: { x: number; z: number }[];

  constructor(engine: Engine) {
    // This creates a basic Babylon Scene object (non-mesh)
    super(engine)
    // this.debugLayer.show();
    // console.log("Creating scene soft")
    this.collisionsEnabled = true;
    this.createCamera()
    this.grounds = []
    var offset = -20
    this.groundsData = [
      {
        modelID: "Desert.babylon",
        meshName: "Desert",
        position: new Vector3(400, offset, 100)
      },
      {
        modelID: "mossy.babylon",
        meshName: "Mossy",
        position: new Vector3(0, offset, 0)
      },
      {
        modelID: "snowMountain.babylon",
        meshName: "Snow",
        position: new Vector3(0, offset, -220)
      },
      {
        modelID: "volcan.babylon",
        meshName: "Volcan",
        position: new Vector3(200, offset, 450)
      },
      {
        modelID: "Sand.babylon",
        meshName: "Sable",
        position: new Vector3(200, offset - 7.5, 150)
      },
    ]

    this.treePositions = [
      { x: 1, z: 2 }, { x: 3, z: 2 }, { x: 4, z: 2 }, { x: 2, z: 6 }, { x: 10, z: 10 },
      { x: 3, z: 21 }, { x: 8, z: 8 }, { x: 1, z: 9 }, { x: 4, z: 15 }, { x: 25, z: 24 },
      { x: 27, z: 24 }, { x: 29, z: 24 }, { x: 50, z: 40 }, { x: 45, z: 45 }, { x: 34, z: 43 },
      { x: 64, z: 42 }, { x: 10, z: 24 }, { x: 4, z: 30 }, { x: 4, z: 50 },
      { x: 1, z: 2 }, { x: 3, z: 2 }, { x: 4, z: 2 }, { x: 2, z: 6 }, { x: 10, z: 10 },
      { x: 3, z: 21 }, { x: 8, z: 8 }, { x: 1, z: 9 }, { x: 4, z: 15 }, { x: 25, z: 24 },
      { x: 27, z: 24 }, { x: 29, z: 24 }, { x: 50, z: 40 }, { x: 45, z: 45 }, { x: 34, z: 43 },
      { x: 64, z: 42 }, { x: 10, z: 24 }, { x: 4, z: 30 }, { x: 4, z: 50 },
      { x: 1, z: 2 }, { x: 3, z: 2 }, { x: 4, z: 2 }, { x: 2, z: 6 }, { x: 10, z: 10 },
      { x: 3, z: 21 }, { x: 8, z: 8 }, { x: 1, z: 9 }, { x: 4, z: 15 }, { x: 25, z: 24 },
      { x: 27, z: 24 }, { x: 29, z: 24 }, { x: 50, z: 40 }, { x: 45, z: 45 }, { x: 34, z: 43 },
      { x: 64, z: 42 }, { x: 10, z: 24 }, { x: 4, z: 30 }, { x: 4, z: 50 },
      { x: 1, z: 2 }, { x: 3, z: 2 }, { x: 4, z: 2 }, { x: 2, z: 6 }, { x: 10, z: 10 },
      { x: 3, z: 21 }, { x: 8, z: 8 }, { x: 1, z: 9 }, { x: 4, z: 15 }, { x: 25, z: 24 },
      { x: 27, z: 24 }, { x: 29, z: 24 }, { x: 50, z: 40 }, { x: 45, z: 45 }, { x: 34, z: 43 },
      { x: 64, z: 42 }, { x: 10, z: 24 }, { x: 4, z: 30 }, { x: 4, z: 50 },
    ]

    this.heightRay = new Ray(new Vector3(0, 0, 0), new Vector3(0, -1, 0), 100);

    //this.assetManager = this.configureAssetManager();
    this.createGround()
  }

  // configureAssetManager(): undefined | AssetsManager {
  //   return
  // }

  createCamera() {
    // This creates and positions a free camera (non-mesh)
    var camera = new FreeCamera("camera1", new Vector3(0, 10, -10), this);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());
  }

  getHeightAtPoint(x: number, z: number): number | undefined {
    this.heightRay.origin = new Vector3(x, 60, z)

    var hits = this.multiPickWithRay(this.heightRay, (m) => { return m.isPickable });
    var filtered = hits?.filter(e => e.pickedMesh && this.grounds!.includes(e.pickedMesh.name))

    if (filtered !== undefined && filtered.length > 0) {
      var hit = filtered[filtered.length - 1]
      if (hit !== null && hit.pickedPoint) {
        return hit.pickedPoint.y
      }
    }
    return undefined;
  }

  abstract loadGround(path: String, modelID: String, meshName: String, position: Vector3, scaling: number): void;

  abstract createGround(): void;
};