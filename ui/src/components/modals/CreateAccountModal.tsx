import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import { Component } from 'react';

type Props = { onClick?: () => void };

export default class CreateAccountModal extends Component<Props, {}> {
  render() {
    return (
      <Stack spacing={2} dir="rtl">
        <Typography variant="h6" component="h2">
          تکانو خسته
        </Typography>
        <Divider sx={{ width: '100%' }} />
        <Typography>
          <p>این بخش رو نیاز دارین ؟</p>
          <p>حوصله یا حصله دارین ؟</p>
          <p>بیخیالش باشه ؟ مهمون من باشید &#128514; &#128514; &#128514;</p>
        </Typography>
        <Divider sx={{ width: '100%' }} />
        <Box>
          <Button variant="contained" onClick={this.props?.onClick}>
            حله &#128514; &#128517;
          </Button>
        </Box>
      </Stack>
    );
  }
}
