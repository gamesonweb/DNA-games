import { Component, ReactNode } from "react";

export class ReactNoServer extends Component {
  render(): ReactNode {
    return <div className="no-server">
      <img alt="Sad smiley..." src="./img/smiley-sad.png"></img>
      <span className="txt-white e404">Error 404 - Server is sleeping</span>
      <span>But wait, you can play this : <a href="https://fissored.github.io/TimeToTank/">this</a> game</span>
    </div>
  }
}