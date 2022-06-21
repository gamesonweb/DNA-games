import { Component, createRef, ReactNode, RefObject, StrictMode } from "react"
import { render } from "react-dom"
import { canvas, sphere1 } from "../babylon/main"
import { getTime } from "../babylon/tools"
import { sendMessage } from "../connectionWS"

export var input: HTMLInputElement

type MessageContent = {
    sender: string,
    isAuthor: boolean,
    date: string,
    content: string,
    isStatus: boolean,
    isConnected: boolean
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
            if (event.currentTarget.value !== "") {
                this.sendMessageFromPlayer(event.currentTarget.value)
                event.currentTarget.value = ""
            } else
                this.exitChat()
        }
    }

    sendMessageFromPlayer(msg: string) {
        var time = getTime()
        if (sphere1) {
            this.writeMessageInChat(time, sphere1.name, msg, true)
            sendMessage(time, msg)
        }
    }

    writeMessageInChat(date: string, sender: string, content: string, isAuthor: boolean) {
        // let chat = document.getElementById("chatbox")
        let msgs = this.state.content;

        msgs.push({ content, date, sender, isAuthor, isConnected: true, isStatus: false })
        this.setState({ content: msgs })
        this.chatRef.current!.scrollTop = this.chatRef.current!.scrollHeight
    }

    displayStatusInChat(date: string, sender: string, isConnected: boolean) {
        let content = (isConnected ? " " : " dis") + "connected."
        let msgs = this.state.content;
        msgs.push({ content, date, sender, isAuthor: false, isStatus: true, isConnected })
        this.setState({ content: msgs })
        this.chatRef.current!.scrollTop = this.chatRef.current!.scrollHeight
    }

    render(): ReactNode {
        return (<div onClick={() => this.enterChat()} style={{ display: this.state.displayChat ? "" : "none" }}>
            <div id="chatbox" className='sc' ref={this.chatRef}>
                {this.state.content.map(({ content, date, isAuthor, sender, isStatus, isConnected }, pos) =>
                    <div key={pos}>
                        {date}
                        <span style={{ color: (isStatus ? (isConnected ? "#00FF00" : "#FF0000 ") : (isAuthor ? "#0ca418ee" : "#2162fbee")) }}> {sender + (isStatus ? content : "")}{isStatus ? "" : " (Mage): "}</span>
                        {isStatus ? "" : content.replace(/</g, "&lt;")}
                        <br />
                    </div>
                )}
            </div>
            <input ref={this.inputRef} style={{ visibility: (this.state.visible ? "visible" : "hidden") }} type="text" id="message" maxLength={60} size={55} onKeyDown={e => this.inputChange(e)} />
        </div>)
    }
}

export let chatRef = createRef<Chat>();

export function initChat() {
    render(
        <StrictMode>
            <Chat ref={chatRef} />
        </StrictMode>,
        document.getElementById("chatAnchor")
    );
}