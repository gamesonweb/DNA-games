import { Component, ReactNode, StrictMode } from "react";
import { Col, Form, InputGroup } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import { render } from "react-dom";
import { PLAYER_CLASSES_LIST, PLAYER_CLASSES_TYPE } from "../babylon/avatars/heroes/classes/playerClasses";
import { ConnectionClient } from "../connection/connectionClient";
import ReactMain, { SECTION } from "./main";
import { windowExists } from "./tools";

type State = {
  name: string,
  class: PLAYER_CLASSES_TYPE
}

type Props = { setSection: (section: SECTION) => void }

export class ReactLogin extends Component<Props, State> {
  constructor(p: Props) {
    super(p);
    this.state = {
      name: "",
      class: PLAYER_CLASSES_LIST[0]
    }
  }

  render(): ReactNode {
    let rowParam = "justify-content-center px-3 text-white "
    return <Col className="col-xl-4 col-md-6 col-9">
      <Row className={rowParam}>
        Hi curious explorer !
      </Row>
      <Row className={rowParam}>
        You are entering a fantastic world
      </Row>
      <Row className={rowParam + "mb-3"}>  But before : </Row>

      <Row className={rowParam}>

        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text className="w-25">Your class:</InputGroup.Text>

          <Form.Select
            defaultValue={PLAYER_CLASSES_LIST[0]}
            onChange={e =>
              this.setState({ class: e.currentTarget.value as PLAYER_CLASSES_TYPE })
            }
          >
            <option disabled hidden>{PLAYER_CLASSES_LIST[0]}</option>
            {PLAYER_CLASSES_LIST.map((option, index) => {
              return <option key={index} >
                {option}
              </option>
            })}
          </Form.Select>
        </InputGroup>
      </Row>

      <Row className={rowParam}>
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text className="w-25">Your name: </InputGroup.Text>
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            autoFocus

            onChange={e => {
              let val = e.currentTarget.value;
              if (val.match(/^([a-z0-9A-Z]|-)*$/) === null) {
                e.currentTarget.value = val.substring(0, val.length - 1)
              }
              this.setState({ name: e.currentTarget.value! })
            }}

            onKeyDown={e => {
              if (e.key === "Enter" || e.key === "NumpadEnter") {
                console.log(this.state);

                ConnectionClient.setGlobalWebSocket(this.state.class, this.state.name)
                this.props.setSection("LOADING")
              }
            }}
          />
        </InputGroup>
      </Row>
    </Col>
  }
}

export function askUsername() {
  if (windowExists())
    render(
      <StrictMode>
        <ReactMain />
      </StrictMode>,
      document.getElementById("root")
    );
}