import { ConnectionClient } from './clients/connection/connectionClient';
import './clients/css/index.css';

export function main() {
  ConnectionClient.setGlobalWebSocket()
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
