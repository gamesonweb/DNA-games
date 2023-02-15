import { Component, ReactNode } from "react";
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
    return <div className="loadingReact">Loading: {this.numToStr()} % </div>
  }
}


