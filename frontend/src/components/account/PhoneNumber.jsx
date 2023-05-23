import React from 'react';
import { forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';

const phoneInput = (props, ref) => {
  return (
    <TextField
      {...props}
      style={{ width: '100%' }}
      inputRef={ref}
      fullWidth
      required
      size="small"
      label="Phone Number"
      variant="standard"
      name="phone"
      InputLabelProps={{ style: { color: '#ffffff' } }}
      InputProps={{ style: { color: '#ffffff' } }}
    />
  );
};

export default forwardRef(phoneInput);
