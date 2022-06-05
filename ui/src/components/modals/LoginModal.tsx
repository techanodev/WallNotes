import { Button, ButtonGroup, Modal, Paper, Stack, Typography, Divider } from '@mui/material';
import { Component } from 'react';
import Auth from '../../utils/Auth';
import CreateAccountModal from './CreateAccountModal';
import QuestModal from './QuestModal';

type State = {
  isShow: boolean;
  panel: 'welcome' | 'quest' | 'create-account' | 'login';
};

type Props = {
  onAuth: () => void;
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  width: '80%',
  bgcolor: 'background.paper',
  border: 'none',
  outline: 'none',
  boxShadow: 24,
  p: 4
};

export default class LoginModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isShow: true, panel: 'welcome' };
  }

  componentDidMount() {
    const isLogin = Auth.getToken();
    this.changeState(!isLogin);
    if (isLogin) {
      this.props.onAuth();
    }
  }

  changeState(state: boolean) {
    this.setState({ isShow: state });
  }

  useAsGuest() {
    this.setState({ panel: 'quest' });
  }

  onGuestCreate() {
    this.changeState(false);
    this.props.onAuth();
  }

  render() {
    return (
      <>
        <Modal
          open={this.state.isShow}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Paper sx={style}>
            {this.state.panel === 'welcome' && (
              <Stack alignItems="end" spacing={2}>
                <Typography id="modal-modal-title" variant="h6" component="h2" dir="rtl">
                  خوش آمدید
                </Typography>
                <Divider sx={{ width: '100%' }} />
                <Typography id="modal-modal-description" dir="rtl">
                  <Typography>خب خوش اومدی</Typography>
                  <Typography>
                    برای ساخت نوت تو گوشی باید انگشتتون رو روی صفحه نگه دارین و تو لپتاپ یا pc دابل
                    کلیک کنید
                  </Typography>
                  <Typography>بزن بریم</Typography>
                </Typography>
                <Divider sx={{ width: '100%' }} />
                <ButtonGroup>
                  <Button variant="outlined" onClick={() => this.useAsGuest()}>
                    به عنوان مهمان
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => this.setState({ panel: 'create-account' })}
                  >
                    می خواهم یک حساب کاربری داشته باشم
                  </Button>
                </ButtonGroup>
              </Stack>
            )}
            {this.state.panel === 'quest' && (
              <QuestModal
                onSubmit={() => this.onGuestCreate()}
                onCancel={() => this.setState({ panel: 'welcome' })}
              />
            )}
            {this.state.panel === 'create-account' && (
              <CreateAccountModal onClick={() => this.setState({ panel: 'welcome' })} />
            )}
          </Paper>
        </Modal>
      </>
    );
  }
}
