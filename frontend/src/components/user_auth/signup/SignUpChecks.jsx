import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import '../../../stylesheets/user_auth.css';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

export default function SignUpChecks(props) {
  const isMobile = props.isMobile;

  const setFirst_hackathon = props.setFirst_hackathon;
  const setFirst_hophacks = props.setFirst_hophacks;
  const setLearn_about_us = props.setLearn_about_us;

  const resumeFile = props.resumeFile;
  const resumeChecked = props.resumeChecked;
  const conductCodeChecked = props.conductCodeChecked;
  const eventLogisticsChecked = props.eventLogisticsChecked;
  const communicationChecked = props.communicationChecked;
  const profileSubmitMsg = props.profileSubmitMsg;
  const enabledButton = props.enabledButton;

  const handleChecksNext = props.handleChecksNext;
  const handleChecksBack = props.handleChecksBack;
  const handleResumeFileChange = props.handleResumeFileChange;
  const handleResumeCheckBox = props.handleResumeCheckBox;
  const handleConductCheckBox = props.handleConductCheckBox;
  const handleLogisticsCheckBox = props.handleLogisticsCheckBox;
  const handleCommunicationCheckBox = props.handleCommunicationCheckBox;

  function openCodeOfConduct(event) {
    event.preventDefault();
    window.open('https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md', '_blank');
  }
  function openPrivacy(event) {
    event.preventDefault();
    window.open('https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md', '_blank');
  }
  function openTerms(event) {
    event.preventDefault();
    window.open('https://github.com/MLH/mlh-policies/blob/main/contest-terms.md', '_blank');
  }

  function openPhotoRelease(event) {
    event.preventDefault();
    window.open(img('JHU_Photo-and-Video-Release_20192.pdf'), '_blank');
  }

  const resume = (
    <FormGroup style={{ display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={resumeChecked}
              onChange={handleResumeCheckBox}
              checkedIcon={<CheckCircleIcon style={{ color: '#57A773' }} />}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="#061A40"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: '#061A40' }}>
            <span>
              * I authorize HopHacks to send my resume to our event sponsors for recruiting
              purposes. I also consent to this
            </span>
            <a href={img('JHU_Photo-and-Video-Release_20192.pdf')} onClick={openPhotoRelease}>
              {' photo release form'}
            </a>
            <span>.</span>
          </div>
        }
      />
    </FormGroup>
  );

  const codeOfConduct = (
    <FormGroup style={{ display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={conductCodeChecked}
              onChange={handleConductCheckBox}
              checkedIcon={<CheckCircleIcon style={{ color: '#57A773' }} />}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="#061A40"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: '#061A40' }}>
            <span>* I have read and understand the </span>
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
              onClick={openCodeOfConduct}
            >
              MLH Code of Conduct
            </a>
            <span>.</span>
          </div>
        }
      />
    </FormGroup>
  );

  const eventLogistics = (
    <FormGroup style={{ display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={eventLogisticsChecked}
              onChange={handleLogisticsCheckBox}
              checkedIcon={<CheckCircleIcon style={{ color: '#57A773' }} />}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="#061A40"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: '#061A40' }}>
            <span>
              * I authorize you to share my application/registration information with Major League
              Hacking for event administration, ranking, and MLH administration in-line with
              the{' '}
            </span>
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              onClick={openPrivacy}
            >
              MLH Privacy Policy
            </a>
            <span>. I further agree to the terms of both the </span>
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
              onClick={openTerms}
            >
              MLH Terms and Conditions
            </a>
            <span> and the</span>
            <a
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              onClick={openPrivacy}
            >
              {' '}
              MLH Privacy Policy
            </a>
            <span>.</span>
          </div>
        }
      />
    </FormGroup>
  );

  const communication = (
    <FormGroup style={{ display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={communicationChecked}
              onChange={handleCommunicationCheckBox}
              checkedIcon={<CheckCircleIcon style={{ color: '#57A773' }} />}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="#061A40"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: '#061A40' }}>
            <span>
              {' '}
              (Optional) I authorize MLH to send me occasional emails about relevant events, career
              opportunities, and community announcements.{' '}
            </span>
          </div>
        }
      />
    </FormGroup>
  );

  const profileCard = (
    <Card class="card">
      <CardContent>
        <Typography class={isMobile ? 'mobile-header' : 'card-title'}>CREATE A PROFILE</Typography>
        <Typography class={isMobile ? 'mobile-subheader' : 'card-subtitle'}>
          step 2: additional info
        </Typography>
        <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>
          more information about you
        </Typography>
        <Grid container spacing={isMobile ? 2 : 5}>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <span style={{ color: '#061A40', float: 'left' }}>
                Is this your first time attending a hackathon?*
              </span>
              <TextField
                required
                variant="standard"
                style={{ width: '100%' }}
                onChange={(e) => {
                  setFirst_hackathon(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <span style={{ color: '#061A40', float: 'left' }}>
                Is this your first time attending HopHacks?*
              </span>
              <TextField
                required
                variant="standard"
                style={{ width: '100%' }}
                onChange={(e) => {
                  setFirst_hophacks(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </TextField>
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <span style={{ color: '#061A40', float: 'left' }}> How did you learn about us?*</span>
              <TextField
                required
                variant="standard"
                style={{ width: '100%' }}
                onChange={(e) => {
                  setLearn_about_us(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              >
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Linkedin">Linkedin</MenuItem>
                <MenuItem value="Google">Google</MenuItem>
                <MenuItem value="Major League Hacking">Major League Hacking</MenuItem>
                <MenuItem value="Email Listerv">Email Listerv</MenuItem>
                <MenuItem value="Friend">Friend</MenuItem>
                <MenuItem value="On Campus Flyers">On Campus Flyers</MenuItem>
                <MenuItem value="In Class Promotion">In Class Promotion</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </div>
          </Grid>
          <Grid item xs={12} style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <div className="text-field">
              <label htmlFor="upload-resume">
                <input
                  style={{ display: 'none' }}
                  accept=".pdf, .doc, .docx"
                  id="upload-resume"
                  type="file"
                  name="upload-resume"
                  onChange={handleResumeFileChange}
                />
                <Button variant="outlined" style={{ color: '#061A40' }} component="span">
                  Upload Resume*
                </Button>
                {isMobile ? <br /> : null}
                {resumeFile !== undefined && (
                  <text style={{ marginLeft: isMobile ? '0rem' : '1rem', color: '#061A40' }}>
                    {'Uploaded:' + resumeFile.name}
                  </text>
                )}
              </label>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="text-field">
              {resume}
              {codeOfConduct}
              {eventLogistics}
              {communication}
            </div>
          </Grid>
        </Grid>

        <Typography class="card-text-red">{profileSubmitMsg}</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              class="card-button"
              variant="contained"
              color="primary"
              size="large"
              disabled={!enabledButton}
              style={{
                fontSize: '1.5rem',
                width: isMobile ? '10rem' : '15rem',
                height: isMobile ? '3rem' : '4rem',
                marginTop: isMobile ? '10%' : '5%'
              }}
              onClick={() => {
                handleChecksBack();
              }}
            >
              Back
            </Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              class="card-button"
              variant="contained"
              color="primary"
              size="large"
              disabled={!enabledButton}
              style={{
                fontSize: '1.5rem',
                width: isMobile ? '10rem' : '15rem',
                height: isMobile ? '3rem' : '4rem',
                marginTop: isMobile ? '10%' : '5%'
              }}
              onClick={() => {
                handleChecksNext();
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return <div>{profileCard}</div>;
}
