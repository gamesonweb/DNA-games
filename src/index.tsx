import { createRef, StrictMode } from 'react';
import { render } from 'react-dom';
import { initFunction } from './babylon/main';
import './css/index.css';
import { Chat } from './reactComponents/chat';

export let chatRef = createRef<Chat>();

render(
  <StrictMode>
    <Chat ref={chatRef} />
  </StrictMode>,
  document.getElementById("chatAnchor")
);

initFunction()


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
