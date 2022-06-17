import { Axis } from "babylonjs";
import { canvas, sphere1 } from "./main";

export var inputStates: {
    space: Boolean,
    Z: Boolean
    Q: Boolean,
    S: Boolean,
    D: Boolean,
    right: Boolean,
    left: Boolean
}

export function inializeInputListeners() {
    inputStates = {
        space: false,
        Z: false,
        Q: false,
        S: false,
        D: false,
        right: false,
        left: false
    }

    window.addEventListener('keydown', (evt) => {
        keyListener(evt, true)
    });

    window.addEventListener('keyup', (evt) => {
        keyListener(evt, false)
    });

    pointerLockAndMouseMove();
}

function keyListener(evt: KeyboardEvent, isPressed: Boolean) {

    // tirer
    if (evt.code === "Space") {
        inputStates.space = isPressed;
    }

    // movements
    else if (evt.code === "KeyW") {
        inputStates.Z = isPressed;
    }
    else if (evt.code === "KeyS") {
        inputStates.S = isPressed;
    }
    else if (evt.code === "KeyA") {
        inputStates.Q = isPressed;
    }
    else if (evt.code === "KeyD") {
        inputStates.D = isPressed;
    }

    //rotation
    else if (evt.code === "ArrowRight") {
        inputStates.right = isPressed;
    }
    else if (evt.code === "ArrowLeft") {
        inputStates.left = isPressed;
    }
}

function pointerLockAndMouseMove() {
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock; // || (<any>canvas).webkitPointerLockElement

    //turret direction is responding to cursor movements
    window.addEventListener("mousemove", (evt) => {
        if (sphere1) {
            if (evt.movementX > 0) {
                sphere1.rotate(Axis.Y, Math.sqrt(evt.movementX) / 200);
                sphere1.didSomething = true;
            }
            if (evt.movementX < 0) {
                sphere1.rotate(Axis.Y, - Math.sqrt(-evt.movementX) / 200);
                sphere1.didSomething = true;
            }
        }
    });

    let isLocked = () => document.pointerLockElement === canvas; // || (<any>document).mozPointerLockElement === canvas

    canvas.onpointerdown = function () {
        if (!isLocked()) canvas.requestPointerLock();
    }
}