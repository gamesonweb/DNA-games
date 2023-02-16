import { Component, createRef, ReactNode, RefObject } from "react"
import { Col, Form, InputGroup, Row } from "react-bootstrap"
import { canvas, scene, sphere1 } from "../babylon/main"
import { getTimeToString, teleport } from "../babylon/others/tools"
import { sendMessage } from "../connection/connectionClient"

export var input: HTMLInputElement

export const messageInformationList = ["Login", "Logout"] as const;
export type MessageInformation = (typeof messageInformationList)[number];


export const messagePlayersList = ["AuthorMsg", "OtherPlayerMsg"] as const
export type MessagePlayers = (typeof messagePlayersList)[number];

export type MessageType = MessagePlayers | MessageInformation

type MessageContent = {
    sender: string,
    date: string,
    content: string,
    msgType: MessageType
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
        // console.log("Show");
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
            }
            this.exitChat()
        }
    }

    sendMessageFromPlayer(msg: string) {
        if (sphere1) {
            if (msg.startsWith("/")) {
                this.cheatCode(msg)
                return
            }
            var time = getTimeToString()
            this.writeMessageInChat(time, sphere1.name, msg, "AuthorMsg")
            sendMessage(time, msg)
        }
    }

    cheatCode(msg: string) {
        switch (msg) {
            //teleport cheat codes
            case "/tp_forest": {
                if (scene.groundsData[1] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to forest island.", "OtherPlayerMsg")
                    teleport(sphere1, scene.groundsData[1].position)
                }
                break;
            }
            case "/tp_desert": {
                if (scene.groundsData[0] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to desert island.", "OtherPlayerMsg")
                    teleport(sphere1, scene.groundsData[0].position)
                }
                break;
            }
            case "/tp_volcan": {
                if (scene.groundsData[3] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to volcan island.", "OtherPlayerMsg")
                    teleport(sphere1, scene.groundsData[3].position)
                }
                break;
            }
            case "/tp_mountain": {
                if (scene.groundsData[2] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to mountain island.", "OtherPlayerMsg")
                    teleport(sphere1, scene.groundsData[2].position)
                }
                break;
            }
            case "/pos": {
                if (sphere1) {
                    console.log(sphere1.shape.position);
                }
                break;
            }
            default: {
                this.writeMessageInChat("", "error", msg + " is not a valid command.", "OtherPlayerMsg")
            }
        }
    }

    scrollBottom = () => {
        this.chatRef.current!.scrollTop = this.chatRef.current!.scrollHeight
    }

    writeMessageInChat(date: string, sender: string, content: string, msgType: MessagePlayers) {
        let msgs = this.state.content;
        msgs.push({ content, date, sender, msgType })
        this.setState({ content: msgs }, this.scrollBottom)
    }

    displayStatusInChat(date: string, sender: string, msgType: MessageInformation) {
        let msgs = this.state.content;
        msgs.push({ content: "New " + msgType + ": ", date, sender, msgType })
        this.setState({ content: msgs }, this.scrollBottom)
    }

    isMessagePlayer = (m: string) => messagePlayersList.includes(m as MessagePlayers)

    senderTextDisplay(e: { sender: string, msgType: MessageType, content: string }) {
        return " " + (this.isMessagePlayer(e.msgType) ? "Mage" : e.content) + " " + e.sender
    }

    messagePlayers(e: { msgType: MessageType, content: string }) {
        return (this.isMessagePlayer(e.msgType)) ? (": " + e.content.replace(/</g, "&lt;")) : ""
    }

    render(): ReactNode {
        const colorAuthor = (msgType: MessageType) => {
            switch (msgType) {
                case "AuthorMsg": return "#0ca418ee"
                case "OtherPlayerMsg": return "#2162fbee"
                case "Logout": return "#FF0000 "
                case "Login": return "#00FF00"
            }
        }
        return (
            <Col onClick={() => this.enterChat()} style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                height: "30%",
                width: "360px"
            }} className="d-flex flex-row bd-highlight flex-column align-self-end justify-content-end">
                <Row ref={this.chatRef} className='sc overflow-auto' id="chatbox">
                    {this.state.content.map(({ content, date, sender, msgType }, pos) =>
                        <Row key={pos}>
                            <p className="p-0 m-0 text-break">
                                {date}
                                <span style={{ color: colorAuthor(msgType) }}>
                                    {this.senderTextDisplay({ sender, msgType, content })}
                                </span>
                                {this.messagePlayers({ msgType, content })}
                            </p>
                        </Row>
                    )}
                </Row>
                <Row>
                    <InputGroup size="sm" className="mb-3" style={{ visibility: (this.state.visible ? "visible" : "hidden") }}>
                        <InputGroup.Text className="w-25">Message: </InputGroup.Text>
                        <Form.Control
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            autoFocus
                            ref={this.inputRef}
                            onKeyDown={e => this.inputChange(e as any)}
                        />
                    </InputGroup>
                </Row>
            </Col>)
    }
}
