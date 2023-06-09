import { Engine, FreeCamera, Scene, Vector3, Ray, MeshBuilder, Axis } from "babylonjs";

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

    this.treePositions = TREE_POSITION_DATA


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

  createWaterGround() {
    var water_ground = MeshBuilder.CreatePlane("water_ground", { size: 2000 })
    water_ground.checkCollisions = true
    water_ground.rotate(Axis.X, Math.PI / 2)
    water_ground.position.y = -27
    water_ground.freezeWorldMatrix();
    water_ground.isPickable = true;
    return water_ground
  }
};

const TREE_POSITION_DATA = [
  { x: 40.86, z: -25.59 },
  { x: -13.02, z: 43.70 },
  { x: -9.60, z: 3.96 },
  { x: 59.44, z: -35.45 },
  { x: 16.14, z: 44.71 },
  { x: -13.84, z: 17.52 },
  { x: 0.09, z: -10.62 },
  { x: 27.28, z: 19.86 },
  { x: -40.77, z: 23.56 },
  { x: 38.52, z: -65.19 },
  { x: 43.06, z: 13.00 },
  { x: 19.82, z: -67.70 },
  { x: -1.73, z: -42.10 },
  { x: -15.56, z: -7.99 },
  { x: 31.90, z: 65.56 },
  { x: -28.68, z: 36.26 },
  { x: 39.65, z: 53.49 },
  { x: 65.60, z: -3.64 },
  { x: 48.50, z: -29.31 },
  { x: 17.06, z: -25.14 },
  { x: 3.52, z: -65.42 },
  { x: -29.23, z: 21.76 },
  { x: 39.68, z: 65.92 },
  { x: 32.18, z: -44.97 },
  { x: -48.02, z: 31.08 },
  { x: -68.84, z: 9.62 },
  { x: 42.80, z: -6.88 },
  { x: -56.38, z: 68.75 },
  { x: 48.80, z: 2.14 },
  { x: 73.18, z: 35.52 },
  { x: 9.92, z: 14.14 },
  { x: 61.61, z: -45.67 },
  { x: -13.44, z: -26.14 },
  { x: 66.30, z: 3.11 },
  { x: 33.49, z: 70.05 },
  { x: -70.86, z: 1.77 },
  { x: -65.44, z: -55.08 },
  { x: -14.93, z: 60.12 },
  { x: -19.01, z: -51.89 },
  { x: 21.79, z: 0.58 },
  { x: -63.65, z: -31.43 },
  { x: 2.60, z: 46.76 },
  { x: -2.52, z: -39.89 },
  { x: 9.58, z: 69.82 },
  { x: -38.48, z: -44.27 },
  { x: -3.96, z: 48.30 },
  { x: 64.56, z: -3.78 },
  { x: -47.96, z: -38.13 },
  { x: 38.80, z: 64.87 },
  { x: -42.69, z: -68.47 },
  { x: 40.69, z: -1.83 },
  { x: -54.97, z: 19.17 },
  { x: 38.01, z: 4.56 },
  { x: -47.96, z: -2.76 },
  { x: -57.53, z: -70.93 },
  { x: -22.26, z: -2.75 },
  { x: 12.12, z: 71.84 },
  { x: 49.78, z: -36.99 },
  { x: -55.90, z: -8.64 },
  { x: -59.72, z: 32.95 },
  { x: -62.47, z: -13.44 },
  { x: 52.79, z: -58.96 },
  { x: 51.46, z: -54.29 },
  { x: 17.00, z: -54.70 },
  { x: 0.38, z: 46.48 },
  { x: -55.89, z: -61.57 },
  { x: -18.08, z: -30.80 },
  { x: 73.03, z: -67.94 },
  { x: 28.01, z: 10.17 },
  { x: -26.59, z: 28.66 },
  { x: -2.26, z: -18.22 },
  { x: -35.60, z: -49.47 },
  { x: -47.28, z: 11.30 },
  { x: 26.04, z: -54.89 },
  { x: -71.87, z: -34.69 },
  { x: 62.34, z: -57.14 },
  { x: 25.07, z: 25.12 },
  { x: 50.51, z: -50.43 },
  { x: -11.78, z: 60.14 },
  { x: 41.42, z: -18.71 },
  { x: -65.50, z: -10.35 },
  { x: 13.94, z: -16.90 },
  { x: -9.75, z: -58.40 },
  { x: 24.45, z: -2.46 },
  { x: 13.89, z: -51.86 },
  { x: -18.60, z: 36.07 },
  { x: -74.42, z: 28.51 },
  { x: 16.89, z: 38.61 },
  { x: 14.93, z: 67.36 },
  { x: 41.17, z: 56.04 },
  { x: -68.19, z: -4.88 },
  { x: 25.52, z: 73.57 },
  { x: 72.05, z: -52.07 },
  { x: 63.86, z: -54.67 },
  { x: -55.40, z: 15.17 },
  { x: -64.19, z: 55.52 },
  { x: 22.55, z: 5.22 },
  { x: 68.41, z: -69.51 },
  { x: -57.64, z: -62.83 },
  { x: 68.26, z: 48.46 },
  { x: 46.85, z: 45.85 },
  { x: -61.22, z: 42.34 },
  { x: -32.63, z: -68.02 },
  { x: -73.42, z: 30.44 },
  { x: -38.65, z: -46.57 },
  { x: -44.48, z: -29.09 },
  { x: -70.05, z: -28.31 },
  { x: -2.72, z: -56.64 },
  { x: -71.97, z: -69.08 },
  { x: 45.16, z: -24.44 },
  { x: 8.99, z: -39.62 },
  { x: -65.01, z: -1.50 },
  { x: 40.93, z: 24.42 },
  { x: -67.83, z: -29.89 },
  { x: -60.63, z: -66.93 },
  { x: -20.20, z: 16.92 },
  { x: -51.80, z: 26.04 },
  { x: 10.59, z: -71.30 },
  { x: 51.22, z: 18.10 },
  { x: -46.34, z: 8.90 },
  { x: -60.11, z: -11.30 },
  { x: 61.54, z: 53.63 },
  { x: 62.31, z: 40.56 },
  { x: -10.67, z: 50.10 },
  { x: -60.73, z: 33.80 },
  { x: 16.25, z: -7.31 },
  { x: -10.72, z: 58.85 },
  { x: 32.38, z: 29.74 },
  { x: 1.74, z: 3.61 },
  { x: 26.46, z: -70.04 },
  { x: 10.91, z: -19.36 },
  { x: -59.89, z: -21.98 },
  { x: 72.34, z: 5.74 },
  { x: 20.38, z: -44.02 },
  { x: 6.79, z: -24.07 },
  { x: -73.79, z: 47.80 },
  { x: 40.87, z: -51.37 },
  { x: -34.09, z: 5.33 },
  { x: 38.89, z: 44.85 },
  { x: 54.69, z: 29.87 },
  { x: -42.10, z: 56.01 },
  { x: 69.16, z: 1.92 },
  { x: -69.38, z: -49.44 },
  { x: 0.00, z: -18.33 },
  { x: 66.72, z: 14.67 },
  { x: -7.76, z: -66.04 },
  { x: 54.16, z: -11.63 },
  { x: 71.15, z: -35.94 },
  { x: 29.76, z: 14.86 },
  { x: 14.44, z: -47.24 },
  { x: 19.07, z: -7.08 },
  { x: -29.55, z: 45.46 },
  { x: -37.66, z: 37.69 },
  { x: 26.49, z: -11.77 },
  { x: -29.39, z: -7.71 },
  { x: -72.75, z: -51.50 },
  { x: -3.04, z: -46.99 },
  { x: -65.33, z: 1.24 },
  { x: 34.72, z: -62.93 },
  { x: 42.86, z: -44.08 },
  { x: -62.52, z: -7.12 },
  { x: 11.11, z: -9.45 },
  { x: -74.92, z: 17.36 },
  { x: 51.86, z: 34.90 },
  { x: -1.92, z: 46.48 },
  { x: 44.85, z: -57.50 },
  { x: -67.47, z: -17.19 },
  { x: 16.61, z: -0.08 },
  { x: -15.71, z: -14.52 },
  { x: -4.93, z: -29.77 },
  { x: 71.51, z: -52.01 },
  { x: -58.40, z: -28.45 },
  { x: -23.08, z: -73.80 },
  { x: -59.83, z: -50.94 },
  { x: 54.92, z: -18.61 },
  { x: 69.94, z: -66.39 },
  { x: 23.07, z: 11.78 },
  { x: -5.86, z: 40.40 },
  { x: 41.14, z: 29.62 },
  { x: -55.81, z: 50.12 },
  { x: -70.83, z: -72.65 },
  { x: 35.23, z: 41.21 },
  { x: 20.97, z: 49.37 },
  { x: 57.56, z: 4.61 },
  { x: -4.72, z: 30.87 },
  { x: 29.85, z: 16.05 },
  { x: -57.58, z: 0.92 },
  { x: 58.11, z: 74.28 },
  { x: -4.82, z: 61.42 },
  { x: -20.41, z: 24.57 },
  { x: -43.75, z: 55.39 },
  { x: 73.80, z: -15.69 },
  { x: -71.27, z: -25.81 },
  { x: -70.76, z: 28.09 },
  { x: 68.75, z: -41.09 },
  { x: 36.47, z: -35.21 },
  { x: 12.69, z: 49.41 },
  { x: 30.87, z: 53.78 },
  { x: -28.46, z: 51.45 },
  { x: 66.29, z: 12.76 },
  { x: 20.49, z: 74.09 },
  { x: -64.35, z: -51.17 },
  { x: -64.20, z: 38.05 },
  { x: -66.16, z: 30.13 },
  { x: -56.43, z: 29.87 },
  { x: 62.31, z: 24.72 },
  { x: -42.08, z: -58.09 },
  { x: -38.48, z: 3.39 },
  { x: 37.68, z: -27.08 },
  { x: 23.83, z: -29.40 },
  { x: -37.64, z: -73.07 },
  { x: -18.56, z: 64.04 },
  { x: -52.57, z: -35.76 },
  { x: -58.40, z: 27.06 },
  { x: 5.88, z: -53.51 },
  { x: 1.42, z: 22.78 },
  { x: 13.68, z: -17.75 },
  { x: 73.45, z: 6.80 },
  { x: -51.82, z: -60.51 },
  { x: 69.60, z: -32.00 },
  { x: -29.59, z: -55.47 },
  { x: -41.58, z: 8.60 },
  { x: 42.08, z: 53.05 },
  { x: -10.44, z: -17.05 },
  { x: 18.86, z: -72.17 },
  { x: 61.45, z: 59.63 },
  { x: 9.37, z: -9.02 },
  { x: -63.63, z: 6.47 },
  { x: 5.82, z: -47.22 },
  { x: 69.28, z: -64.23 },
  { x: 46.48, z: 29.84 },
  { x: 74.10, z: 0.18 },
  { x: 56.96, z: 17.02 },
  { x: -38.40, z: 18.03 },
  { x: -74.24, z: -8.71 },
  { x: -51.24, z: 8.73 },
  { x: -2.27, z: 30.46 },
  { x: 32.40, z: -5.89 },
  { x: -69.45, z: 57.57 },
  { x: 1.79, z: -9.78 },
  { x: -1.53, z: 59.60 },
  { x: 25.43, z: -62.07 },
  { x: 7.85, z: -70.84 },
  { x: 5.45, z: -39.35 },
  { x: -29.77, z: 13.87 },
  { x: -14.57, z: 57.87 },
  { x: -55.84, z: -58.02 },
  { x: -73.29, z: 29.11 },
  { x: 1.82, z: 45.16 },
  { x: -41.99, z: -38.36 },
  { x: 71.42, z: 10.59 },
  { x: 26.76, z: -49.04 },
  { x: -13.84, z: 70.03 },
  { x: -31.15, z: 63.14 },
  { x: -29.50, z: 53.21 },
  { x: 3.50, z: 15.23 },
  { x: -40.34, z: 20.51 },
  { x: -22.66, z: 48.24 },
  { x: -18.09, z: 24.68 },
  { x: 59.56, z: -15.00 },
  { x: 37.45, z: 48.49 },
  { x: 36.86, z: -47.74 },
  { x: -19.66, z: 30.19 },
  { x: -41.20, z: 2.45 },
  { x: 22.74, z: 7.44 },
  { x: 29.05, z: 49.32 },
  { x: -37.19, z: 23.07 },
  { x: 18.64, z: -33.44 },
  { x: 72.16, z: 41.35 },
  { x: 14.27, z: -21.66 },
  { x: 12.35, z: 68.71 },
  { x: -5.72, z: -44.33 },
  { x: -31.35, z: -15.95 },
  { x: -73.17, z: 18.42 },
  { x: -56.49, z: -71.74 },
  { x: 2.21, z: -40.53 },
  { x: -16.29, z: 6.97 },
  { x: 12.73, z: 18.90 },
  { x: 1.97, z: 51.81 },
  { x: -59.75, z: 35.94 },
  { x: -18.66, z: -31.61 },
  { x: 12.50, z: 67.41 },
  { x: -53.14, z: 67.68 },
  { x: 23.63, z: 1.17 },
  { x: -34.58, z: -17.46 },
  { x: 21.72, z: -11.15 },
  { x: -29.72, z: 66.68 },
  { x: -74.42, z: -60.38 },
  { x: 29.23, z: 24.88 },
  { x: -32.26, z: -33.77 },
  { x: 24.08, z: 19.33 },
  { x: -49.65, z: -25.44 },
  { x: -31.35, z: -15.31 },
  { x: 8.26, z: 13.24 },
  { x: -18.08, z: -36.23 },
  { x: -16.37, z: -42.24 },
  { x: 54.40, z: 20.36 },
  { x: -2.10, z: 29.29 },
  { x: 29.53, z: 23.50 },
  { x: -71.93, z: 33.95 },

]