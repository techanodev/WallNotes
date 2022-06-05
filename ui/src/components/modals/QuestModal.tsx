import { Box, Button, ButtonGroup, Divider, Stack, TextField, Typography } from '@mui/material';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Auth from '../../utils/Auth';
import Request from '../../utils/Request';

type Props = {
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

type State = {
  isSend: boolean;
};

export default class QuestModal extends Component<Props, State> {
  private nameText: React.RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.state = { isSend: false };

    this.nameText = React.createRef();
  }

  onClick() {
    const name = this.nameText.current?.value;
    if (!name || name === '') {
      toast.error('یک نام باید وارد نمایید');
      return;
    }

    this.setState({ isSend: true });

    Request.send('v1/register/guest', { method: 'POST', data: { name: name } })
      .then((result) => {
        if (result.data.status) Auth.setToken(result.data.token);
        toast.success('کاربر مهمان با موفقیت ساخته شد');
        this.props.onSubmit(name);
      })
      .catch((_e) => {
        toast.error('خطایی در ایجاد کاربر مهمان رخ داده است.');
      })
      .finally(() => {
        this.setState({ isSend: false });
      });
  }

  render() {
    return (
      <Stack spacing={2} alignItems="end">
        <Typography component="h2" variant="h6">
          ورود به عنوان مهمان
        </Typography>
        <Divider sx={{ width: '100%' }} />
        <Box dir="rtl">
          <TextField
            label="یک نام برای خود انتخاب نمایید"
            placeholder="یک نام کوتاه حداکثر تا 15 حرف برای خود انتخاب نمایید"
            inputRef={this.nameText}
            fullWidth
          />
        </Box>
        <Divider sx={{ width: '100%' }} />
        <ButtonGroup dir="ltr">
          <Button variant="outlined" onClick={this.props.onCancel} disabled={this.state.isSend}>
            نظرم عوض شد
          </Button>
          <Button variant="contained" onClick={() => this.onClick()} disabled={this.state.isSend}>
            {this.state.isSend ? 'در حال ساخت حساب کاربر' : 'تایید'}
          </Button>
        </ButtonGroup>
      </Stack>
    );
  }
}
