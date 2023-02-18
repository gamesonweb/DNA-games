import 'bootstrap/dist/css/bootstrap.min.css';
import './clients/css/index.css';

import { createRef, StrictMode } from 'react';
import { render } from 'react-dom';
import ReactMain from './clients/reactComponents/main';
import { windowExists } from './clients/reactComponents/tools';

export const refReactMain = createRef<ReactMain>()

export function main() {
  if (windowExists())
    render(
      <StrictMode>
        <ReactMain ref={refReactMain} />
      </StrictMode>,
      document.getElementById("root")
    );
}