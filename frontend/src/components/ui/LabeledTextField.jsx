import React from 'react';
import { TextField } from '@material-ui/core';

export default function LabeledTextField({
  label,
  type = 'text',
  value,
  onChange,
  select = false,
  children,
  required = true,
  style = {},
  textColor = '#061A40',
  InputProps = {},
  InputLabelProps = {},
  ...rest
}) {
  return (
    <div className="bg-white rounded-md p-2">
      <TextField
        required={required}
        variant="standard"
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        select={select}
        style={{ width: '100%', ...style }}
        InputLabelProps={{
          shrink: true,
          style: {
            color: textColor,
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
            maxWidth: '100%',
            ...(InputLabelProps?.style || {})
          },
          ...InputLabelProps
        }}
        InputProps={{
          style: {
            color: textColor,
            ...(InputProps?.style || {})
          },
          ...InputProps
        }}
        {...rest}
      >
        {select ? children : null}
      </TextField>
    </div>
  );
}
