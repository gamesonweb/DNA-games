import { Axis } from "babylonjs";
import { chatRef } from "..";
import { input } from "../reactComponents/chat";
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

let createInputStates = () => {
    return {
        space: false,
        Z: false,
        Q: false,
        S: false,
        D: false,
        right: false,
        left: false
    }
}

export function inializeInputListeners() {
    inputStates = createInputStates()

    canvas.addEventListener('keydown', (evt) => {
        keyListener(evt, true)
    });

    canvas.addEventListener('keyup', (evt) => {
        keyListener(evt, false)
    });

    canvas.addEventListener("keypress", (evt) => {
        keyPressListener(evt)
    })

    canvas.addEventListener('keydown', (evt) => {
        if ((evt.code === "Enter" || evt.code === "NumpadEnter")) {
            inputStates = createInputStates()
            chatRef.current!.enterChat()
        }
    });

    pointerLockAndMouseMove();
}

function keyListener(evt: KeyboardEvent, isPressed: Boolean) {

    if ((input === document.activeElement) && isPressed) { return }

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

export function pointerLockAndMouseMove() {
    canvas.requestPointerLock = canvas.requestPointerLock ||
        canvas.mozRequestPointerLock; // || (<any>canvas).webkitPointerLockElement

    //turret direction is responding to cursor movements
    canvas.addEventListener("mousemove", (evt) => {
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

let keyPressListener = (evt: KeyboardEvent) => {
    if (evt.code === "KeyC") {
        chatRef.current!.toggleChat()
    }
}
