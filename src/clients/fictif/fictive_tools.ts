import { Vector3 } from "babylonjs"

export function distance(a: Vector3, b: Vector3) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}