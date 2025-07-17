import React from 'react';
import {
  MenuItem,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LabeledTextField from '../../ui/LabeledTextField';
import '../../../stylesheets/user_auth.css';
import GlowButton from '../../ui/GlowButton';

const openLink = (url) => (e) => {
  e.preventDefault();
  window.open(url, '_blank');
};

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

const SignUpChecks = ({
  isMobile,
  setFirst_hackathon,
  setFirst_hophacks,
  setLearn_about_us,
  resumeFile,
  resumeChecked,
  conductCodeChecked,
  eventLogisticsChecked,
  communicationChecked,
  profileSubmitMsg,
  enabledButton,
  handleChecksNext,
  handleChecksBack,
  handleResumeFileChange,
  handleResumeCheckBox,
  handleConductCheckBox,
  handleLogisticsCheckBox,
  handleCommunicationCheckBox,
  setLinkedIn
}) => {
  const img = (url) => `https://hophacks-website.s3.amazonaws.com/images/${url}`;

  const fieldProps = {
    select: true,
    required: true,
    variant: 'standard',
    style: { width: '100%' }
  };

  return (
    <div>
      <p
        className="font-bold text-white text-xl text-center mb-10"
        style={{ fontVariant: 'small-caps' }}
      >
        3. Additional Info
      </p>
      <Grid container spacing={isMobile ? 2 : 5}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <LabeledTextField
              label="Is this your first time attending a hackathon?"
              onChange={(e) => setFirst_hackathon(e.target.value)}
              {...fieldProps}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </LabeledTextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <LabeledTextField
              label="Is this your first time attending HopHacks?"
              onChange={(e) => setFirst_hophacks(e.target.value)}
              {...fieldProps}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </LabeledTextField>
          </Grid>

          <Grid item xs={12} md={4}>
            <LabeledTextField
              label="How did you learn about us?"
              onChange={(e) => setLearn_about_us(e.target.value)}
              {...fieldProps}
            >
              {[
                'Instagram',
                'Facebook',
                'Linkedin',
                'Google',
                'Major League Hacking',
                'Email Listerv',
                'Friend',
                'On Campus Flyers',
                'In Class Promotion',
                'Other'
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </LabeledTextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <LabeledTextField
              label="Link to LinkedIn Profile"
              required={true}
              onChange={(e) => setLinkedIn(e.target.value)}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <label htmlFor="upload-resume">
            <input
              style={{ display: 'none' }}
              accept=".pdf, .doc, .docx"
              id="upload-resume"
              type="file"
              name="upload-resume"
              onChange={handleResumeFileChange}
            />
            <Button
              variant="outlined"
              style={{ color: '#061A40', background: '#FFFFFF' }}
              component="span"
            >
              Upload Resume*
            </Button>
            {resumeFile && (
              <span style={{ marginLeft: isMobile ? '0' : '1rem', color: '#FFFFFF' }}>
                Uploaded: {resumeFile.name}
              </span>
            )}
          </label>
        </Grid>

        <Grid item xs={12}>
          <div className="text-field">
            <CustomCheckbox
              checked={resumeChecked}
              onChange={handleResumeCheckBox}
              label={
                <>
                  * I authorize HopHacks to send my resume to our event sponsors for recruiting
                  purposes. I also consent to this
                  <a
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
                  * I authorize you to share my application with MLH for administration in line with
                  the
                  <a
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
                  (Optional) I authorize MLH to send me occasional emails about relevant events and
                  opportunities.
                </>
              }
            />
          </div>
        </Grid>
      </Grid>
      <div className="w-full flex justify-end">
        <a
          className="underline text-white hover:text-blue-600 transition-colors duration-300"
          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
          target="_blank"
          rel="noreferrer"
        >
          MLH code of conduct
        </a>
      </div>

      <Typography className="card-text-red">{profileSubmitMsg}</Typography>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <GlowButton onClick={handleChecksBack} variant="secondary" disabled={!enabledButton}>
          Back
        </GlowButton>
        <GlowButton onClick={handleChecksNext} disabled={!enabledButton}>
          Next
        </GlowButton>
      </div>
    </div>
  );
};

export default SignUpChecks;
