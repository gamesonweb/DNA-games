import React from 'react';
import { render } from 'react-dom';
import { initFunction } from './babylon/main';
import './css/index.css';
import { MyBody } from './reactComponents/MyBody';

render(
  <React.StrictMode>
    <MyBody />
  </React.StrictMode>,
  document.getElementById("root")
);

window.onload = initFunction


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
