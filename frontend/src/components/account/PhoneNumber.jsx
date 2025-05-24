import React from 'react';
import { forwardRef } from 'react';
import LabeledTextField from '../ui/LabeledTextField';

const phoneInput = (props, ref) => {
  return (
    <LabeledTextField
      {...props}
      label="Phone Number"
      name="phone"
      required
      size="small"
      variant="standard"
      fullWidth
      inputRef={ref}
      style={{ width: '100%' }}
      InputLabelProps={{
        style: { color: '#061A40' },
        ...(props.InputLabelProps || {})
      }}
      InputProps={{
        style: {
          color: '#061A40',
          ...(props.InputProps?.style || {})
        },
        ...(props.InputProps || {})
      }}
    />
  );
};

export default forwardRef(phoneInput);
