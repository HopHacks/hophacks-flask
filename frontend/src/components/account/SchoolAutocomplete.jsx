import React, { useState, useEffect } from 'react';
import LabeledTextField from '../ui/LabeledTextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

const SchoolAutocomplete = function SchoolAutocomplete({ school, setSchool }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  // for school autocomplete
  useEffect(() => {
    const response = require('./list.json');
    setOptions(Object.values(response));
  }, []);

  return (
    <Autocomplete
      id="schools"
      style={{ width: '100%' }}
      open={open}
      value={{ name: school }}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        setSchool(newValue !== null ? newValue.name : '');
      }}
      renderInput={(params) => (
        <LabeledTextField
          label="School"
          value={school}
          required
          {...params}
          InputProps={{
            ...params.InputProps,
            style: {
              color: '#061A40'
            },
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          InputLabelProps={{
            style: { color: '#061A40' }
          }}
        />
      )}
    />
  );
};
export default SchoolAutocomplete;
