import { sendMessage } from "./connectionWS"
import { canvas, sphere1 } from "./main"
import { getTime } from "./tools"

export var input: HTMLInputElement

export function initChat() {
    let chatbox = document.getElementById("chatbox")
    input = document.getElementById("message") as HTMLInputElement

    if (chatbox) {
        chatbox.onclick = () => {
            makeInputVisible()
        }
    }

    chatbox?.addEventListener("onclick", function (event) {
        makeInputVisible()
    })

    window.addEventListener('keydown', (evt) => {
        if ((evt.code === "Enter" || evt.code === "NumpadEnter")) {
            makeInputVisible()
        }
    });

    input?.addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            // Cancel the default action, if needed
            event.preventDefault()
            if (input.value != "") {
                sendMessageFromPlayer(input.value)
                input.value = ""
                input.style.visibility = "hidden"
                canvas.focus()
            }
        }
    });
}

export function makeInputVisible() {
    if (input) {
        input.style.visibility = "visible";
        input.focus();
    }
}

export function writeMessageInChat(time: string, author: string, msg: string, isSender: boolean) {
    let chat = document.getElementById("chatbox")
    let content = chat?.innerHTML
    if (chat != null) {
        chat.innerHTML = content + time + " " + "<span style='color: " + (isSender ? "#0ca418ee" : "#2162fbee") + ";'>" + author + " (Mage): " + "</span>" + msg.replace(/</g, "&lt;") + "<br />"
        chat.scrollTop = chat.scrollHeight;
    }
}

export function sendMessageFromPlayer(msg: string) {
    var time = getTime()
    if (sphere1) {
        writeMessageInChat(time, sphere1.avatar_username, msg, true)
        sendMessage(time, msg)
    }
}