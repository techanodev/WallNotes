import { Component } from "react"
import { Button, Modal } from 'react-bootstrap'
import Auth from "../../utils/Auth"
import QuestModal from "./QuestModal"

type State = {
    isShow: boolean
    panel: "welcome" | "quest" | "create-account" | "login"
}

type Props = {
    onAuth: () => void
}

export default class LoginModal extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = { isShow: false, panel: "welcome" }
    }

    componentDidMount() {
        const isLogin = Auth.getToken()
        this.changeState(!isLogin)
        if (isLogin) {
            this.props.onAuth()
        }
    }

    changeState(state: boolean) {
        this.setState({ isShow: state })
    }

    useAsGuest() {
        this.setState({ panel: "quest" })
    }

    onGuestCreate() {
        this.changeState(false)
        this.props.onAuth()
    }

    render() {
        return <>
            <Modal
                show={this.state.isShow}
                backdrop="static"
                keyboard={false}
                dir="rtl"
            >
                {this.state.panel == "welcome" &&
                    <>
                        <Modal.Header>
                            <Modal.Title>خوش آمدید</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p dir="rtl">
                                شما می توانید حساب کاربری خود را داشته باشید، آیا می خواهید یک حساب کاربری در این سایت ایجاد کنید یا میخواهید به عنوان مهمان ادامه دهید ؟
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.useAsGuest()}>
                                به عنوان مهمان
                            </Button>
                            <Button variant="primary">می خواهم یک حساب کاربری داشته باشم</Button>
                        </Modal.Footer>
                    </>
                }
                {this.state.panel == "quest" && <QuestModal onSubmit={() => this.onGuestCreate()} />}
            </Modal>
        </>
    }
}