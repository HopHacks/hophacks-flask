import React from 'react'
import { forwardRef } from 'react'
import TextField from '@material-ui/core/TextField'

const phoneInput = (props, ref) => {
  return (
    <TextField
      {...props}
      style={{ maxWidth: 245 }}
      inputRef={ref}
      fullWidth
      required
      size='small'
      label='Phone Number'
      variant='standard'
      name='phone'
      InputLabelProps={{style: {color: '#000000'}}}
    />
  )
}

export default forwardRef(phoneInput)
