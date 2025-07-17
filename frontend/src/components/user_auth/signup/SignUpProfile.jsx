import React from 'react';
import { MenuItem, Typography, Grid, FormControl, FormHelperText } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import GlowButton from '../../ui/GlowButton';

import MajorAutocomplete from '../../account/MajorAutocomplete';
import SchoolAutocomplete from '../../account/SchoolAutocomplete';
import CountryAutocomplete from '../../account/CountryAutocomplete';
import PhoneNumber from '../../account/PhoneNumber';
import LabeledTextField from '../../ui/LabeledTextField';

import '../../../stylesheets/user_auth.css';

export default function SignUpProfile({
  isMobile,
  setFirst_name,
  setLast_name,
  setAge,
  setGender,
  setEthnicity,
  phone_number,
  setPhone_number,
  school,
  setSchool,
  otherSchool,
  setOtherSchool,
  major,
  setMajor,
  setGrad,
  setGrad_month,
  setGrad_year,
  setCountry,
  profileSubmitMsg,
  enabledButton,
  handleProfileNext,
  handleProfileBack
}) {
  const renderMenuItems = (items) =>
    items.map((item) => (
      <MenuItem key={item} value={item}>
        {item}
      </MenuItem>
    ));

  const genders = [
    'Male',
    'Female',
    'Non-Binary',
    'Transgender',
    'Intersex',
    'Not listed',
    'Prefer not to disclose'
  ];
  const ethnicities = [
    'American Indian or Alaska Native',
    'Asian',
    'Black or African American',
    'Hispanic, Latino or Spanish Origin',
    'Middle Eastern or North African',
    'Native Hawaiian or Other Pacific Islander',
    'White',
    'Multiethnic',
    'Prefer not to disclose'
  ];
  const gradLevels = [
    'Undergraduate University (2 year - community college or similar)',
    'Undergraduate University (3+ year)',
    'Graduate University (Masters, Professional, Doctoral, etc)',
    'Code School / Bootcamp',
    'Other Vocational / Trade Program or Apprenticeship',
    'Post Doctorate',
    'Other'
  ];
  const months = [...Array(12).keys()].map((m) => String(m + 1).padStart(2, '0'));
  const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  const SECONDARY_COLOR = '#29A0E2';

  return (
    <div>
      <p
        className="font-bold text-white text-xl text-center mb-5"
        style={{ fontVariant: 'small-caps' }}
      >
        2. Basic Info
      </p>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <LabeledTextField label="First Name" onChange={(e) => setFirst_name(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <LabeledTextField label="Last Name" onChange={(e) => setLast_name(e.target.value)} />
        </Grid>

        <Grid item xs={12} md={4}>
          <LabeledTextField label="Age" type="number" onChange={(e) => setAge(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <LabeledTextField label="Gender" onChange={(e) => setGender(e.target.value)} select>
            {renderMenuItems(genders)}
          </LabeledTextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <LabeledTextField label="Ethnicity" onChange={(e) => setEthnicity(e.target.value)} select>
            {renderMenuItems(ethnicities)}
          </LabeledTextField>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl variant="standard" required style={{ width: '100%' }}>
            <SchoolAutocomplete school={school} setSchool={setSchool} />
          </FormControl>
          <FormHelperText style={{ color: SECONDARY_COLOR }}>
            {"* If your school is not in the list, choose 'other schools'"}
          </FormHelperText>
        </Grid>

        <Grid item xs={12} md={6}>
          <MajorAutocomplete major={major} setMajor={setMajor} />
          <FormHelperText style={{ color: SECONDARY_COLOR }}>
            {"* If your major is not in the list, choose 'other majors'"}
          </FormHelperText>
        </Grid>

        {school === 'Other Schools' && (
          <Grid item xs={12}>
            <LabeledTextField
              label="Other School"
              value={otherSchool}
              onChange={(e) => setOtherSchool(e.target.value)}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <CountryAutocomplete setCountry={setCountry} />
        </Grid>

        <Grid item xs={12} md={6}>
          <PhoneInput
            international
            withCountryCallingCode
            onChange={setPhone_number}
            inputComponent={PhoneNumber}
            value={phone_number}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <LabeledTextField label="Level of Study" onChange={(e) => setGrad(e.target.value)} select>
            {renderMenuItems(gradLevels)}
          </LabeledTextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <LabeledTextField
            label="Grad Month"
            onChange={(e) => setGrad_month(e.target.value)}
            select
          >
            {renderMenuItems(months)}
          </LabeledTextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <LabeledTextField label="Grad Year" onChange={(e) => setGrad_year(e.target.value)} select>
            {renderMenuItems(years)}
          </LabeledTextField>
        </Grid>
      </Grid>
      <Typography className="card-text-red mt-4">{profileSubmitMsg}</Typography>
      <div
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: 'center',
          marginTop: '2rem',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '1rem' : 0
        }}
      >
        <GlowButton onClick={handleProfileBack} variant="secondary" disabled={!enabledButton}>
          Back
        </GlowButton>
        <GlowButton onClick={handleProfileNext} disabled={!enabledButton}>
          Next
        </GlowButton>
      </div>
    </div>
  );
}
