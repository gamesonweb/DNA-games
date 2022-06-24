import { Component, ReactNode, StrictMode } from "react";
import { render } from "react-dom";
import { windowExists } from "./tools";

export class NoServer extends Component {
  render(): ReactNode {
    return <div className="no-server">
      <img alt="Sad smiley..." src="./img/smiley-sad.png"></img>
      <span className="txt-white e404">Error 404 - Server is sleeping</span>
      <span>But wait, you can play this : <a href="https://fissored.github.io/TimeToTank/">this</a> game</span>
    </div>
  }
}

export function ErrorNoServer() {
  if (windowExists())
    render(
      <StrictMode>
        <NoServer />
      </StrictMode>,
      document.getElementById("root")
    );
}