import { Component, createRef, ReactNode } from "react";
import { Container, Row } from "react-bootstrap";
import { Chat } from "./chat";
import { ReactLoadingScreen } from "./loadingScreen";
import { ReactLogin } from "./login";
import { ReactNoServer } from "./noServer";

export type SECTION = "GAME" | "LOGIN" | "LOADING" | "NO_SERVER"

export let chatRef = createRef<Chat>();
export let loadingRef = createRef<ReactLoadingScreen>();

export default class ReactMain extends Component<{}, { section: SECTION }> {
  constructor(p: {}) {
    super(p)
    this.state = { section: "LOGIN" }
  }

  setSection = (section: SECTION) => { this.setState({ section }) }

  getSection = () => {
    switch (this.state.section) {
      case "GAME": return <Chat ref={chatRef} />
      case "LOADING": return <ReactLoadingScreen ref={loadingRef} setSection={this.setSection} />
      case "LOGIN": return <ReactLogin setSection={this.setSection} />
      case "NO_SERVER": return <ReactNoServer />
    }
  }

  render(): ReactNode {
    let canvasSize = this.state.section === "GAME" ? { width: "100%", height: "100%" } : { width: 0, height: 0 }
    return <Container fluid className="d-flex align-items-center justify-content-center fullHeight bg-black" >
      <canvas id="canvas" style={{ position: "absolute", touchAction: "none", ...canvasSize }}></canvas>
      <Row className="justify-content-center w-100">
        {this.getSection()}
      </Row>
    </Container>

  }
}