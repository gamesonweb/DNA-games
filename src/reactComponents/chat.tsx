import { Component, createRef, ReactNode, RefObject } from "react"
import { sendMessage } from "../babylon/connectionWS"
import { canvas, sphere1 } from "../babylon/main"
import { getTime } from "../babylon/tools"

export var input: HTMLInputElement

type MessageContent = {
    sender: string,
    isAuthor: boolean,
    date: string,
    content: string
}

export class Chat extends Component<{}, { visible: boolean, content: MessageContent[], displayChat: boolean }>{
    inputRef: RefObject<HTMLInputElement>;
    chatRef: RefObject<HTMLDivElement>;

    constructor(props: string) {
        super(props)
        this.state = {
            visible: false,
            content: [],
            displayChat: true
        }
        this.inputRef = createRef<HTMLInputElement>()
        this.chatRef = createRef<HTMLDivElement>()
    }

    exitChat() {
        this.setState({ visible: false })
        canvas.focus()
    }

    enterChat() {
        this.setState({ visible: true, displayChat: true })
        this.inputRef.current?.focus()
        console.log("Show");
    }

    toggleChat() {
        this.setState({ displayChat: !this.state.displayChat })
    }

    inputChange(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" || event.key === "NumpadEnter") {
            // Cancel the default action, if needed
            event.preventDefault()
            if (event.currentTarget.value != "") {
                this.sendMessageFromPlayer(event.currentTarget.value)
                event.currentTarget.value = ""
            } else
                this.exitChat()
        }
    }

    sendMessageFromPlayer(msg: string) {
        var time = getTime()
        if (sphere1) {
            this.writeMessageInChat(time, sphere1.avatar_username, msg, true)
            sendMessage(time, msg)
        }
    }

    writeMessageInChat(date: string, sender: string, content: string, isAuthor: boolean) {
        // let chat = document.getElementById("chatbox")
        let msgs = this.state.content;
        msgs.push({ content, date, sender, isAuthor })
        this.setState({ content: msgs })
        this.chatRef.current!.scrollTop = this.chatRef.current!.scrollHeight
    }

    render(): ReactNode {
        return (<div onClick={() => this.enterChat()} style={{ display: this.state.displayChat ? "" : "none" }}>
            <div id="chatbox" className='sc' ref={this.chatRef}>
                {this.state.content.map(({ content, date, isAuthor, sender }, pos) =>
                    <div key={pos}>
                        {date}
                        <span style={{ color: isAuthor ? "#0ca418ee" : "#2162fbee" }}> {sender} (Mage:) </span>
                        {content.replace(/</g, "&lt;")}
                        <br />
                    </div>
                )}
            </div>
            <input ref={this.inputRef} style={{ visibility: (this.state.visible ? "visible" : "hidden") }} type="text" id="message" maxLength={60} size={55} onKeyDown={e => this.inputChange(e)} />
        </div>)
    }
}

export function initChat() {
    // let chatbox = document.getElementById("chatbox")
    // input = document.getElementById("message") as HTMLInputElement

    // if (chatbox) {
    //     chatbox.onclick = () => {
    //         makeInputVisible()
    //     }
    // }

    // chatbox?.addEventListener("onclick", function (event) {
    //     makeInputVisible()
    // })

    // window.addEventListener('keydown', (evt) => {
    //     if ((evt.code === "Enter" || evt.code === "NumpadEnter")) {
    //         makeInputVisible()
    //     }
    // });

    // input?.addEventListener("keypress", function (event) {
    //     // If the user presses the "Enter" key on the keyboard
    //     if (event.code === "Enter" || event.code === "NumpadEnter") {
    //         // Cancel the default action, if needed
    //         event.preventDefault()
    //         if (input.value != "") {
    //             sendMessageFromPlayer(input.value)
    //             input.value = ""
    //             input.style.visibility = "hidden"
    //             canvas.focus()
    //         }
    //     }
    // });
}

// export function makeInputVisible() {
//     if (input) {
//         input.style.visibility = "visible";
//         input.focus();
//     }
// }