import React from 'react';
import LabeledTextField from '../ui/LabeledTextField';
import Autocomplete from '@mui/material/Autocomplete';

const MajorAutocomplete = function MajorAutocomplete({ setMajor, major }) {
  const majors = [
    'Africana Studies',
    'Anthropology',
    'Applied Mathematics & Statistics',
    'Archaeology',
    'Behavioral Biology',
    'Biology',
    'Biomedical Engineering',
    'Biophysics',
    'Chemical & Biomolecular Engineering',
    'Chemistry',
    'Civil Engineering',
    'Classics',
    'Cognitive Science',
    'Computer Engineering',
    'Computer Science',
    'Earth & Planetary Sciences',
    'East Asian Studies',
    'Economics',
    'Electrical Engineering',
    'Engineering Mechanics',
    'English',
    'Environmental Engineering',
    'Environmental Science',
    'Environmental Studies',
    'Film & Media Studies',
    'French',
    'General Engineering',
    'German',
    'History',
    'History of Art',
    'History of Science, Medicine & Technology',
    'Interdisciplinary Studies',
    'International Studies',
    'Italian',
    'Materials Science & Engineering',
    'Mathematics',
    'Mechanical Engineering',
    'Medicine, Science & the Humanities',
    'Molecular & Cellular Biology',
    'Natural Sciences',
    'Near Eastern Studies',
    'Neuroscience',
    'Philosophy',
    'Physics',
    'Political Science',
    'Psychology',
    'Public Health Studies',
    'Romance Languages',
    'Sociology',
    'Spanish',
    'Writing Seminars',
    'Other Majors'
  ];

  return (
    <Autocomplete
      id="majors"
      options={majors}
      value={major}
      style={{ width: '100%' }}
      onChange={(event, newValue) => {
        setMajor(newValue);
      }}
      renderInput={(params) => (
        <LabeledTextField
          label="Major"
          required
          style={{ width: '100%' }}
          {...params}
          InputLabelProps={{
            style: { color: '#061A40' },
            ...(params.InputLabelProps || {})
          }}
          InputProps={{
            ...params.InputProps,
            style: {
              color: '#061A40',
              ...(params.InputProps?.style || {})
            }
          }}
        />
      )}
    />
  );
};

export default MajorAutocomplete;
