import { Component, ReactNode } from "react";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { ModelEnum } from "../babylon/others/models";
import { SECTION } from "./main";

type Props = { setSection: (section: SECTION) => void }

export class ReactLoadingScreen extends Component<Props, { content: number }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      content: 0
    }
  }

  updateContent() {
    let content = ((1 - ModelEnum.remainingLoad / ModelEnum.totalLoad) * 100);
    this.setState({ content });
    if (ModelEnum.remainingLoad === 0) {
      this.props.setSection("GAME");
    }
  }

  numToStr() {
    return this.state.content.toFixed(2)
  }

  render(): ReactNode {
    let rowParam = "justify-content-center px-3 text-white "
    return <Col className="col-xl-4 col-md-6 col-9">
      <Row className={rowParam}>Loading: {this.numToStr()} % </Row>
      <ProgressBar animated now={this.state.content} className="p-0" />
    </Col>
  }
}


