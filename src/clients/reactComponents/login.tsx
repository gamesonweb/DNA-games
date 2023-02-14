import { Component, KeyboardEvent, ReactNode, StrictMode } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { ConnectionClient, establishConnection } from "../connection/connectionClient";
import { initChat } from "./chat";
import { windowExists } from "./tools";

export class ReactLogin extends Component<{}, {}> {
  inputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    let val = e.currentTarget.value;
    if (val.match(/^([a-z0-9A-Z]|-)*$/) === null) {
      e.currentTarget.value = val.substring(0, val.length - 1)
    }
  }

  render(): ReactNode {
    return <div className="loginReact">
      <span> Hi curious explorer ! </span>
      <span>You are entering a fantastic world </span>
      <span>  But before enter your name</span>
      <input placeholder="Who are you ?" autoFocus onChange={e => this.inputOnChange(e)} onKeyDown={e => this.inputKeyDown(e)}></input>
    </div>
  }
  inputKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" || e.key === "NumpadEnter") {
      ConnectionClient.setGlobalWebSocket(e.currentTarget.value)
      unmountComponentAtNode(document.getElementById('root')!);
      initChat();
    }
  }
}

export function askUsername() {
  if (windowExists())
    render(
      <StrictMode>
        <ReactLogin />
      </StrictMode>,
      document.getElementById("root")
    );
}