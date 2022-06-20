import { Axis } from "babylonjs";
import { chatRef } from "..";
import { input } from "../reactComponents/chat";
import { canvas, sphere1 } from "./main";

export type InputStates = {
    jump: boolean,
    goForeward: boolean
    goLeft: boolean,
    goBackward: boolean,
    goRight: boolean,
    rotateRight: boolean,
    rotateLeft: boolean,
    attack: boolean
}

let createInputStates = (): InputStates => {
    return {
        jump: false,
        goForeward: false,
        goLeft: false,
        goBackward: false,
        goRight: false,
        rotateRight: false,
        rotateLeft: false,
        attack: false
    }
}

export let inputStates: InputStates;

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

    canvas.addEventListener('mousedown', (evt) => {
        mouseListener(evt, true)
    });

    canvas.addEventListener('mouseup', (evt) => {
        mouseListener(evt, false)
    });

    pointerLockAndMouseMove();
}

function keyListener(evt: KeyboardEvent, isPressed: boolean) {

    if ((input === document.activeElement) && isPressed) { return }

    // tirer
    if (evt.code === "Space") {
        inputStates.jump = isPressed;
    }

    // movements
    else if (evt.code === "KeyW") {
        inputStates.goForeward = isPressed;
    }
    else if (evt.code === "KeyS") {
        inputStates.goBackward = isPressed;
    }
    else if (evt.code === "KeyA") {
        inputStates.goLeft = isPressed;
    }
    else if (evt.code === "KeyD") {
        inputStates.goRight = isPressed;
    }

    //rotation
    else if (evt.code === "ArrowRight") {
        inputStates.rotateRight = isPressed;
    }
    else if (evt.code === "ArrowLeft") {
        inputStates.rotateLeft = isPressed;
    }
}

function mouseListener(evt: MouseEvent, isPressed: boolean) {
    if ((input === document.activeElement) && isPressed) { return }
    switch (evt.which) {
        case 1:
            inputStates.attack = isPressed;
            break;
        default:
            break;
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
