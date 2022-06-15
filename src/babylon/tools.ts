import { Vector3 } from "babylonjs";

export function makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function distance(a: Vector3, b: Vector3) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y + b.y) ** 2 + (a.z + b.z) ** 2);
}

/** Remove elt from L with side effect */
export function removeFromList<T>(elt: T, l: T[]) {
    let pos = l.indexOf(elt)
    if (pos >= 0) l.splice(pos, 1)
}