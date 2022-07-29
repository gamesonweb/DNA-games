import { Component, createRef, ReactNode, StrictMode } from "react";
import { render} from "react-dom";
import { windowExists } from "./tools";

export class ReactLoadingScreen extends Component<{}, {content: string}> {
    constructor(props: string) {
        super(props)
        this.state = {
            content: "Loading... "
        }
    }

    setContent(text: string){
        this.setState({ content: text })
    }
    
  render(): ReactNode {
    return <div className="loadingReact">{this.state.content} </div>
  }
}

export let loadingRef = createRef<ReactLoadingScreen>();

export function displayLoadingScreen() {
  if (windowExists())
    render(
      <StrictMode>
        <ReactLoadingScreen ref={loadingRef} />
      </StrictMode>,
      document.getElementById("root")
    );
}

