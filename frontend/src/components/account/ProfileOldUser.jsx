import {
  MenuItem,
  Typography,
  Grid,
  Checkbox,
  FormGroup,
  FormControl,
  FormHelperText,
  FormControlLabel
} from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import GlowButton from '../ui/GlowButton';

import MajorAutocomplete from './MajorAutocomplete';
import SchoolAutocomplete from './SchoolAutocomplete';
import CountryAutocomplete from './CountryAutocomplete';
import PhoneNumber from './PhoneNumber';
import LabeledTextField from '../ui/LabeledTextField';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//import '../stylesheets/user_auth.css';

//import Login from '../Login';
//import { useHistory } from 'react-router-dom';

import '../../stylesheets/user_auth.css';

const CHECKBOX_STYLE = {
  display: 'table',
  color: '#061A40',
  fontSize: 15,
  textAlign: 'left'
};

const CustomCheckbox = ({ checked, onChange, label }) => (
  <FormGroup style={{ display: 'initial' }}>
    <FormControlLabel
      style={{ display: 'table' }}
      control={
        <div style={{ display: 'table-cell' }}>
          <Checkbox
            checked={checked}
            onChange={onChange}
            checkedIcon={<CheckCircleIcon style={{ color: '#57A773' }} />}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            size="small"
          />
        </div>
      }
      label={<div style={CHECKBOX_STYLE}>{label}</div>}
    />
  </FormGroup>
);

//users with accounts from previous years
export default function ProfileOldUser({
  step,
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
  setLinkedIn,
  profileSubmitMsg,
  enabledButton,
  handleProfileNext,
  resumeChecked,
  setResumeChecked,
  conductCodeChecked,
  setConductCodeChecked,
  eventLogisticsChecked,
  setEventLogisticsChecked,
  communicationChecked,
  setCommunicationChecked,
  first_name = '',
  last_name = '',
  age = '',
  gender = '',
  ethnicity = '',
  grad = '',
  grad_month = '',
  grad_year = '',
  country = '',
  linkedIn = ''
}) {
  const img = (url) => `https://hophacks-website.s3.amazonaws.com/images/${url}`;

  const handleResumeCheckBox = (event) => {
    setResumeChecked(event.target.checked);
  };

  const handleConductCheckBox = (event) => {
    setConductCodeChecked(event.target.checked);
  };

  const handleLogisticsCheckBox = (event) => {
    setEventLogisticsChecked(event.target.checked);
  };

  const handleCommunicationCheckBox = (event) => {
    setCommunicationChecked(event.target.checked);
  };

  const openLink = (url) => (e) => {
    e.preventDefault();
    window.open(url, '_blank');
  };

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

  if (step === 'update info') {
    return (
      <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-screen py-20 px-4">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          <div
            className="w-full max-w-[800px] flex flex-col rounded-2xl p-10 shadow-2xl"
            style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
          >
            <div className="text-center mb-8">
              <p
                className="font-bold text-white text-2xl mb-4"
                style={{ fontVariant: 'small-caps' }}
              >
                Welcome Back
              </p>
              <p className="text-blue-200 text-base mb-2">
                Please verify all of your information from last year is still accurate!
              </p>
              <p className="text-blue-300 text-sm">
                Be sure to fill out any new fields, and upload your latest resume on the next page.
              </p>
            </div>
            <Grid container sx={{ flexGrow: 1 }} spacing={4}>
              {/* Row 1: Name fields */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <LabeledTextField
                  label="First Name"
                  value={first_name}
                  onChange={(e) => setFirst_name(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LabeledTextField
                  label="Last Name"
                  value={last_name}
                  onChange={(e) => setLast_name(e.target.value)}
                />
              </Grid>

              {/* Row 2: Personal info - 3 equal columns */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  select
                >
                  {renderMenuItems(genders)}
                </LabeledTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="Ethnicity"
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  select
                >
                  {renderMenuItems(ethnicities)}
                </LabeledTextField>
              </Grid>

              {/* Row 3: School and Level - better proportions */}
              <Grid size={{ xs: 12, md: 8 }}>
                <FormControl variant="standard" required style={{ width: '100%' }}>
                  <SchoolAutocomplete school={school} setSchool={setSchool} />
                </FormControl>
                <FormHelperText style={{ color: SECONDARY_COLOR }}>
                  {"* If your school is not in the list, choose 'other schools'"}
                </FormHelperText>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <LabeledTextField
                  label="Level of Study"
                  value={grad}
                  onChange={(e) => setGrad(e.target.value)}
                  select
                >
                  {renderMenuItems(gradLevels)}
                </LabeledTextField>
              </Grid>

              {/* Row 4: Major - full width */}
              <Grid size={{ xs: 12 }}>
                <MajorAutocomplete major={major} setMajor={setMajor} />
                <FormHelperText style={{ color: SECONDARY_COLOR }}>
                  {"* If your major is not in the list, choose 'other majors'"}
                </FormHelperText>
              </Grid>

              {/* Conditional Other School field */}
              {school === 'Other Schools' && (
                <Grid size={{ xs: 12 }}>
                  <LabeledTextField
                    label="Other School"
                    value={otherSchool}
                    onChange={(e) => setOtherSchool(e.target.value)}
                  />
                </Grid>
              )}

              {/* Row 5: Country and Phone */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <CountryAutocomplete setCountry={setCountry} country={country} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PhoneInput
                  international
                  withCountryCallingCode
                  onChange={setPhone_number}
                  inputComponent={PhoneNumber}
                  value={phone_number}
                />
              </Grid>

              {/* Row 6: Graduation info - 3 equal columns */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="Grad Month"
                  value={grad_month}
                  onChange={(e) => setGrad_month(e.target.value)}
                  select
                >
                  {renderMenuItems(months)}
                </LabeledTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="Grad Year"
                  value={grad_year}
                  onChange={(e) => setGrad_year(e.target.value)}
                  select
                >
                  {renderMenuItems(years)}
                </LabeledTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <LabeledTextField
                  label="LinkedIn URL"
                  value={linkedIn}
                  onChange={(e) => setLinkedIn(e.target.value)}
                />
              </Grid>
            </Grid>
            <Typography className="text-red-400 mt-4">{profileSubmitMsg}</Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '2rem'
              }}
            >
              <GlowButton onClick={handleProfileNext} disabled={!enabledButton}>
                Next
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (step === 'checks') {
    return (
      <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-screen py-20 px-4">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center">
          <div
            className="w-full max-w-[800px] flex flex-col rounded-2xl p-10 shadow-2xl"
            style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
          >
            <div className="text-center mb-8">
              <p
                className="font-bold text-white text-2xl mb-4"
                style={{ fontVariant: 'small-caps' }}
              >
                Terms & Conditions
              </p>
              <p className="text-blue-200 text-base mb-2">
                Please review and accept the following terms to continue.
              </p>
            </div>

            <Grid container sx={{ flexGrow: 1 }} spacing={4}>
              <Grid size={{ xs: 12 }}>
                <div className="text-field">
                  <CustomCheckbox
                    checked={resumeChecked}
                    onChange={handleResumeCheckBox}
                    label={
                      <>
                        * I authorize HopHacks to send my resume to our event sponsors for
                        recruiting purposes. I also consent to this
                        <a
                          className="underline text-blue-600"
                          href={img('JHU_Photo-and-Video-Release_20192.pdf')}
                          onClick={openLink(img('JHU_Photo-and-Video-Release_20192.pdf'))}
                        >
                          {' '}
                          photo release form
                        </a>
                        .
                      </>
                    }
                  />
                  <CustomCheckbox
                    checked={conductCodeChecked}
                    onChange={handleConductCheckBox}
                    label={
                      <>
                        * I have read and understand the
                        <a
                          className="underline text-blue-600"
                          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                          onClick={openLink(
                            'https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md'
                          )}
                        >
                          {' '}
                          MLH Code of Conduct
                        </a>
                        .
                      </>
                    }
                  />
                  <CustomCheckbox
                    checked={eventLogisticsChecked}
                    onChange={handleLogisticsCheckBox}
                    label={
                      <>
                        * I authorize you to share my application with MLH for administration in
                        line with the
                        <a
                          className="underline text-blue-600"
                          href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                          onClick={openLink(
                            'https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md'
                          )}
                        >
                          {' '}
                          MLH Privacy Policy
                        </a>
                        . I further agree to the
                        <a
                          href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                          onClick={openLink(
                            'https://github.com/MLH/mlh-policies/blob/main/contest-terms.md'
                          )}
                        >
                          {' '}
                          MLH Terms
                        </a>{' '}
                        and
                        <a
                          href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                          onClick={openLink(
                            'https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md'
                          )}
                        >
                          {' '}
                          Privacy Policy
                        </a>
                        .
                      </>
                    }
                  />
                  <CustomCheckbox
                    checked={communicationChecked}
                    onChange={handleCommunicationCheckBox}
                    label={
                      <>
                        (Optional) I authorize MLH to send me occasional emails about relevant
                        events and opportunities.
                      </>
                    }
                  />
                </div>
              </Grid>
            </Grid>

            <Typography className="text-red-400 mt-4">{profileSubmitMsg}</Typography>

            <div className="w-full flex justify-end mt-8">
              <a
                className="underline text-white hover:text-blue-600 transition-colors duration-300"
                href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                target="_blank"
                rel="noreferrer"
              >
                MLH code of conduct
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '2rem'
              }}
            >
              <GlowButton onClick={handleProfileNext} disabled={!enabledButton}>
                Next
              </GlowButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
