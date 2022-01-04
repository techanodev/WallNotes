import { Component } from "react";
import { Button, Modal } from "react-bootstrap";

type Props = { onClick?: () => void }

export default class CreateAccountModal extends Component<Props, {}> {
    render() {
        return <>
            <Modal.Header>
                <Modal.Title>تکانو خسته</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    این بخش رو نیاز دارین ؟
                </p>
                <p>
                    حوصله یا حصله دارین ؟
                </p>
                <p>
                    بیخیالش باشه ؟ مهمون من باشید
                    &#128514;
                    &#128514;
                    &#128514;
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.props?.onClick}>
                    حله
                    &#128514;
                    &#128517;
                </Button>
            </Modal.Footer>
        </>
    }
}