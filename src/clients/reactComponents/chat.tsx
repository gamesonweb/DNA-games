import { Component, createRef, ReactNode, RefObject } from "react"
import { Col, Form, InputGroup, Row } from "react-bootstrap"
import { canvas, scene, sphere1 } from "../babylon/main"
import { getTimeToString, teleport } from "../babylon/others/tools"
import { sendMessage } from "../connection/connectionClient"

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
                this.exitChat()
            }
        }
    }

    sendMessageFromPlayer(msg: string) {
        if (sphere1) {
            if (msg[0] === "/") {
                this.cheatcode(msg)
                return
            }
            var time = getTimeToString()
            this.writeMessageInChat(time, sphere1.name, msg, true)
            sendMessage(time, msg)
        }
    }

    cheatcode(msg: string) {
        switch (msg) {
            //teleport cheat codes
            case "/tp_forest": {
                if (scene.groundsData[1] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to forest island.", false)
                    teleport(sphere1, scene.groundsData[1].position)
                }
                break;
            }
            case "/tp_desert": {
                if (scene.groundsData[0] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to desert island.", false)
                    teleport(sphere1, scene.groundsData[0].position)
                }
                break;
            }
            case "/tp_volcan": {
                if (scene.groundsData[3] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to volcan island.", false)
                    teleport(sphere1, scene.groundsData[3].position)
                }
                break;
            }
            case "/tp_mountain": {
                if (scene.groundsData[2] && sphere1) {
                    this.writeMessageInChat("", "success", "teleport to mountain island.", false)
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
                this.writeMessageInChat("", "error", msg + " is not a valid command.", false)
            }
        }
    }

    writeMessageInChat(date: string, sender: string, content: string, isAuthor: boolean) {
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
        return (
            <Col onClick={() => this.enterChat()} style={{
                position: "absolute",
                bottom: "10px",
                left: "10px",
                height: "30%"
            }} className="col-5 d-flex flex-row bd-highlight mb-3 flex-column col-5 align-self-end justify-content-end">
                <Row ref={this.chatRef} className='sc overflow-auto' id="chatbox">
                    {this.state.content.map(({ content, date, isAuthor, sender, isStatus, isConnected }, pos) =>
                        <Row key={pos}>
                            <Col className="col-2">{date}</Col>
                            <Col className="col-5 text-break" style={{ color: (isStatus ? (isConnected ? "#00FF00" : "#FF0000 ") : (isAuthor ? "#0ca418ee" : "#2162fbee")) }}>{sender + (isStatus ? content : "")}{isStatus ? "" : " (Mage): "}</Col>
                            <Col className="text-break">{isStatus ? "" : content.replace(/</g, "&lt;")}</Col>
                            <br />
                        </Row>
                    )}
                </Row>
                <Row>
                    <InputGroup size="sm" className="mb-3" style={{ visibility: (this.state.visible ? "visible" : "hidden") }}>
                        <InputGroup.Text className="w-25">Msg: </InputGroup.Text>
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
