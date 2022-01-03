import { error } from "console";
import React, { Component } from "react"
import { Button, Form, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify';
import Auth from "../../utils/Auth";
import Request from "../../utils/Request";

type Props = {
    onSubmit: (name: string) => void
}

type State = {
    isSend: boolean
}

export default class QuestModal extends Component<Props, State> {

    private nameText: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
        super(props)

        this.state = { isSend: false }

        this.nameText = React.createRef()
    }

    onClick() {
        const name = this.nameText.current?.value
        if (!name || name == '') {
            toast.error("یک نام باید وارد نمایید");
            return
        }

        this.setState({ isSend: true })

        Request.send('v1/register/guest', { method: 'POST', data: { name: name } }).then(result => {
            if (result.data.status)
                Auth.setToken(result.data.token)
            toast.success('کاربر مهمان با موفقیت ساخته شد')
            this.props.onSubmit(name)
        }).catch(_e => {
            toast.error('خطایی در ایجاد کاربر مهمان رخ داده است.')
        }).finally(() => {
            this.setState({ isSend: false })
        })

    }

    render() {
        return <>
            <Modal.Header>
                <Modal.Title>ورود به عنوان مهمان</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label htmlFor="text-name">یک نام برای خود انتخاب نمایید</Form.Label>
                <Form.Control type='text' id="text-name" ref={this.nameText} maxLength={15} />
                <Form.Text id="passwordHelpBlock" muted={false}>
                    یک نام کوتاه حداکثر تا 15 حرف برای خود انتخاب نمایید
                </Form.Text>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => this.onClick()} disabled={this.state.isSend}>
                    {this.state.isSend ? 'در حال ساخت حساب کاربر' : 'تایید'}
                </Button>
            </Modal.Footer>
        </>
    }
}