import { connect_to_ws } from './clients/connectionWS';
import './clients/css/index.css';

export function main() {
  connect_to_ws();
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
