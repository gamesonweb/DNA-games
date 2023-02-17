import { Axis, FollowCamera } from "babylonjs";
import { wsClient } from "../../connection/connectionClient";
import { serverMessages } from "../../connection/connectionSoft";
import { input } from "../../reactComponents/chat";
import { canvas, scene, sphere1 } from "../main";
import { Player } from "./heroes/player";
import { CharacterState } from "./avatarSoft";
import { chatRef } from "../../reactComponents/main";

type InputStates = {
    jump: boolean,
    goForeward: boolean,
    goLeft: boolean,
    goBackward: boolean,
    goRight: boolean,
    rotateRight: boolean,
    rotateLeft: boolean,
    attack_0: boolean,
    attack_1: boolean,
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
        attack_0: false,
        attack_1: false,
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

    // sauter
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

    //giga jump (development only)
    else if (evt.code === "KeyK") {
        if (sphere1) sphere1.shape.position.y += 10
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
    switch (evt.button) {
        case 2:
            inputStates.attack_1 = isPressed;
            break;
        case 0:
            inputStates.attack_0 = isPressed;
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
                sphere1.shape.rotate(Axis.Y, Math.sqrt(evt.movementX) / 200);
                sphere1.didSomething = true;
            }
            if (evt.movementX < 0) {
                sphere1.shape.rotate(Axis.Y, - Math.sqrt(-evt.movementX) / 200);
                sphere1.didSomething = true;
            }
        }
        if (scene.activeCamera) {
            var camera = scene.activeCamera as FollowCamera;
            if (evt.movementY < 0) {
                // var bottomRay = new Ray(camera.position, new Vector3(0, -1, 0), 2 + Math.sqrt(-evt.movementY))
                // var bottomHit = scene.pickWithRay(bottomRay, cameraBackCollision)
                // if (!bottomHit?.pickedMesh) {
                camera.heightOffset -= Math.sqrt(-evt.movementY) / 20
                camera.heightOffset = Math.max(-1, camera.heightOffset)
                // }
            }
            if (evt.movementY > 0) {
                camera.heightOffset += Math.sqrt(evt.movementY) / 20
                camera.heightOffset = Math.min(8, camera.heightOffset)

            }
        }
    });

    let isLocked = () => document.pointerLockElement === canvas; // || (<any>document).mozPointerLockElement === canvas

    canvas.onpointerdown = function () {
        if (!isLocked()) canvas.requestPointerLock();
    }
}

export function inputEffects(player: Player) {

    if (inputStates.goRight || inputStates.goLeft || inputStates.goBackward || inputStates.goForeward || inputStates.rotateRight || inputStates.rotateLeft || inputStates.attack_0)
        player.didSomething = true;

    let direction = player.shape.getDirection(Axis.Z)

    let coeff_diagonal = 1
    if ((inputStates.goForeward || inputStates.goBackward) && (inputStates.goLeft || inputStates.goRight)) coeff_diagonal = Math.PI / 4;

    if (player.canMove) {
        //forward/backward movement
        if (inputStates.goForeward) {
            player.shape.moveWithCollisions(direction.scale(player.speed_coeff * coeff_diagonal));
            if (player.getStatus() !== CharacterState.Falling && player.getStatus() !== CharacterState.Jumping) {
                player.update_status(CharacterState.Walking_fw)
            }
        } else { if (player.getStatus() === CharacterState.Walking_fw) player.update_status(CharacterState.Idle) }
        if (!inputStates.goForeward && inputStates.goBackward) {
            player.shape.moveWithCollisions(direction.scale(-player.speed_coeff * coeff_diagonal / 2));
            if (player.getStatus() !== CharacterState.Falling && player.getStatus() !== CharacterState.Jumping) {
                player.update_status(CharacterState.Walking_bw)
            }
        } if (!inputStates.goBackward) { if (player.getStatus() === CharacterState.Walking_bw) player.update_status(CharacterState.Idle) }
    }

    //player rotation
    if (inputStates.rotateRight || inputStates.goRight) {
        player.shape.rotate(Axis.Y, +0.03)
    } else if (inputStates.rotateLeft || inputStates.goLeft) {
        player.shape.rotate(Axis.Y, -0.03)
    }

    //player's attack_0
    if (inputStates.attack_0) {
        // player fires the correspondng hit (not onlyDisplay)
        player.hit(0)
        // we send it so server
        wsClient.send(
            JSON.stringify({
                route: serverMessages.PLAYER_HIT,
                content: JSON.stringify({
                    username: player.name,
                    hitmode: 0
                })
            })
        )
    }

    //player's attack_1
    if (inputStates.attack_1) {
        // player fires the correspondng hit (not onlyDisplay)
        player.hit(1)
        // we send it so server
        wsClient.send(
            JSON.stringify({
                route: serverMessages.PLAYER_HIT,
                content: JSON.stringify({
                    username: player.name,
                    hitmode: 1
                })
            })
        )
    }

    //jump
    if (inputStates.jump) {
        if (player.canJump && player.getStatus() !== CharacterState.Punching) {
            player.isJumping = true;
            player.update_status(CharacterState.Jumping)
            player.canJump = false
            setTimeout(() => {
                player.isJumping = false
                if (player.getStatus() === CharacterState.Jumping) player.update_status(CharacterState.Falling)
            }, player.timeJumping)
            // setTimeout(() => {
            //   this.canJump = true
            // }, this.timeJumping)
        }
    }
}
