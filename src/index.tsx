import { createRef, StrictMode } from 'react';
import { render } from 'react-dom';
import { connect_to_ws } from './clients/connectionWS';
import './clients/css/index.css';
import { Chat } from './clients/reactComponents/chat';

export let chatRef = createRef<Chat>();

export function renderReact() {
  render(
    <StrictMode>
      <Chat ref={chatRef} />
    </StrictMode>,
    document.getElementById("chatAnchor")
  );
}


connect_to_ws();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
