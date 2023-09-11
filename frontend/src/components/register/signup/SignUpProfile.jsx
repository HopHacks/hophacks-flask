import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import MajorAutocomplete from '../../account/MajorAutocomplete';
import SchoolAutocomplete from '../../account/SchoolAutocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import PhoneNumber from '../../account/PhoneNumber';

import '../../../stylesheets/register.css';

export default function SignUpProfile(props) {
  const isMobile = props.isMobile;

  const setFirst_name = props.setFirst_name;
  const setLast_name = props.setLast_name;
  const setAge = props.setAge;
  const setGender = props.setGender;
  const setEthnicity = props.setEthnicity;
  const phone_number = props.phone_number;
  const setPhone_number = props.setPhone_number;
  const school = props.school;
  const setSchool = props.setSchool;
  const major = props.major;
  const setMajor = props.setMajor;
  const setGrad = props.setGrad;
  const setGrad_month = props.setGrad_month;
  const setGrad_year = props.setGrad_year;
  const setFirst_hackathon = props.setFirst_hackathon;
  const setFirst_hophacks = props.setFirst_hophacks;
  const setLearn_about_us = props.setLearn_about_us;

  const resumeFile = props.resumeFile;
  const resumeChecked = props.resumeChecked;
  const vaccinationFile = props.vaccinationFile;
  const vaccinationChecked = props.vaccinationChecked;
  const conductCodeChecked = props.conductCodeChecked;
  const eventLogisticsChecked = props.eventLogisticsChecked;
  const communicationChecked = props.communicationChecked;
  const profileSubmitMsg = props.profileSubmitMsg;
  const enabledButton = props.enabledButton;

  const handleProfileNext = props.handleProfileNext;
  const handleResumeFileChange = props.handleResumeFileChange;
  const handleVaccinationCheckBox = props.handleVaccinationCheckBox;
  const handleVaccinationFileChange = props.handleVaccinationFileChange;
  const handleResumeCheckBox = props.handleResumeCheckBox;
  const handleConductCheckBox = props.handleConductCheckBox;
  const handleLogisticsCheckBox = props.handleLogisticsCheckBox;
  const handleCommunicationCheckBox = props.handleCommunicationCheckBox;

  function openCodeOfConduct() {
    window.open('https://static.mlh.io/docs/mlh-code-of-conduct.pdf', '_blank');
  }
  function openPrivacy() {
    window.open('https://mlh.io/privacy', '_blank');
  }
  function openTerms() {
    window.open('https://mlh.io/terms', '_blank');
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
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="white"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: 'white' }}>
            <span>
              * I authorize HopHacks to send my resume to our event sponsors for recruiting
              purposes.
            </span>
          </div>
        }
      />
    </FormGroup>
  );

  const vaccination = (
    <FormGroup style={{ display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={vaccinationChecked}
              onChange={handleVaccinationCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="white"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: 'white' }}>
            <span>* I authorize HopHacks to verify my vaccination card for safety purposes.</span>
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
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="white"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: 'white' }}>
            <span>* I have read and understand the </span>
            <Link onClick={openCodeOfConduct}>MLH Code of Conduct</Link>
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
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="white"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: 'white' }}>
            <span>
              * I authorize you to share my application/registration information with Major League
              Hacking for event administration, ranking, and MLH administration in-line with the{' '}
            </span>
            <Link onClick={openPrivacy}>MLH Privacy Policy</Link>
            <span>. I further agree to the </span>
            <Link onClick={openTerms}>MLH Terms and Conditions</Link>
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
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="white"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15, textAlign: 'left', color: 'white' }}>
            <span>
              {' '}
              (Optional) I authorize MLH to send me pre- and post-event informational emails, which
              contain free credit and opportunities from their partners.{' '}
            </span>
          </div>
        }
      />
    </FormGroup>
  );

  const profileCard = (
    <Card class="card">
      <CardContent>
        <Typography class={isMobile ? 'mobile-header' : 'card-title'}>Create Profile</Typography>

        <Grid container spacing={isMobile ? 2 : 5}>
          <Grid item xs={isMobile ? 12 : 5}>
            <TextField
              required
              variant="standard"
              label="First Name"
              style={{ width: '100%' }}
              onChange={(e) => setFirst_name(e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            />
          </Grid>
          <Grid item xs={isMobile ? 12 : 5}>
            <TextField
              required
              variant="standard"
              label="Last Name"
              style={{ width: '100%' }}
              onChange={(e) => setLast_name(e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            />
          </Grid>
          <Grid item xs={isMobile ? 12 : 2}>
            <TextField
              required
              variant="standard"
              type="number"
              label="Age"
              style={{ width: '100%' }}
              onChange={(e) => setAge(e.target.value)}
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' },
                inputProps: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <TextField
              required
              variant="standard"
              label="Gender"
              style={{ width: '100%' }}
              onChange={(e) => {
                setGender(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Non-Binary">Non-Binary</MenuItem>
              <MenuItem value="Transgender">Transgender</MenuItem>
              <MenuItem value="Intersex">Intersex</MenuItem>
              <MenuItem value="Not listed">Not listed</MenuItem>
              <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <TextField
              required
              variant="standard"
              label="Ethnicity"
              style={{ width: '100%' }}
              onChange={(e) => {
                setEthnicity(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="American Indian or Alaska Native">
                American Indian or Alaska Native
              </MenuItem>
              <MenuItem value="Asian">Asian</MenuItem>
              <MenuItem value="Black or African American">Black or African American</MenuItem>
              <MenuItem value="Hispanic, Latino or Spanish Origin">
                Hispanic, Latino or Spanish Origin
              </MenuItem>
              <MenuItem value="Middle Eastern or North African">
                Middle Eastern or North African
              </MenuItem>
              <MenuItem value="Native Hawaiian or Other Pacific Islander">
                Native Hawaiian or Other Pacific Islander
              </MenuItem>
              <MenuItem value="White">White</MenuItem>
              <MenuItem value="Multiethnic">Multiethnic</MenuItem>
              <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <PhoneInput
              international
              withCountryCallingCode
              onChange={setPhone_number}
              inputComponent={PhoneNumber}
              value={phone_number}
            />
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <FormControl required variant="standard" style={{ width: '100%' }}>
              <SchoolAutocomplete school={school} setSchool={setSchool} />
            </FormControl>
            <FormHelperText style={{ fontSize: 9, color: 'white', width: '100%' }}>
              * If your school is not in the list, choose &apos;other schools&apos;
            </FormHelperText>
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <MajorAutocomplete major={major} setMajor={setMajor} />
            <FormHelperText style={{ fontSize: 9, color: 'white', width: '100%' }}>
              * If your major is not in the list, choose &apos;other majors&apos;
            </FormHelperText>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <TextField
              required
              variant="standard"
              label="Program"
              style={{ width: '100%' }}
              onChange={(e) => {
                setGrad(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="Undergraduate">Undergraduate</MenuItem>
              <MenuItem value="Graduate">Graduate</MenuItem>
              <MenuItem value="Postgraduate">Postgraduate</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <TextField
              required
              variant="standard"
              label="Grad Month"
              style={{ width: '100%' }}
              onChange={(e) => {
                setGrad_month(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="01">01</MenuItem>
              <MenuItem value="02">02</MenuItem>
              <MenuItem value="03">03</MenuItem>
              <MenuItem value="04">04</MenuItem>
              <MenuItem value="05">05</MenuItem>
              <MenuItem value="06">06</MenuItem>
              <MenuItem value="07">07</MenuItem>
              <MenuItem value="08">08</MenuItem>
              <MenuItem value="09">09</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="11">11</MenuItem>
              <MenuItem value="12">12</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <TextField
              required
              variant="standard"
              label="Grad Year"
              style={{ width: '100%' }}
              onChange={(e) => {
                setGrad_year(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="2022">2022</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2025">2025</MenuItem>
              <MenuItem value="2026">2026</MenuItem>
              <MenuItem value="2027">2027</MenuItem>
              <MenuItem value="2028">2028</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <span style={{ color: '#ffffff', float: 'left' }}>
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
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <span style={{ color: '#ffffff', float: 'left' }}>
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
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
              }}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <span style={{ color: '#ffffff', float: 'left' }}> How did you learn about us?*</span>
            <TextField
              required
              variant="standard"
              style={{ width: '100%' }}
              onChange={(e) => {
                setLearn_about_us(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#ffffff' }
              }}
              InputProps={{
                style: { color: '#ffffff' }
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
              <Button variant="outlined" style={{ color: 'white' }} component="span">
                Upload Resume*
              </Button>
              {isMobile ? <br /> : null}
              {resumeFile !== undefined && (
                <text style={{ marginLeft: isMobile ? '0rem' : '1rem', color: 'white' }}>
                  {'Uploaded:' + resumeFile.name}
                </text>
              )}
            </label>
          </Grid>
          <Grid item xs={12} style={{ textAlign: isMobile ? 'center' : 'left' }}>
            <label htmlFor="upload-vaccination">
              <input
                style={{ display: 'none' }}
                accept=".pdf, .doc, .docx"
                id="upload-vaccination"
                type="file"
                name="upload-vaccination"
                onChange={handleVaccinationFileChange}
              />
              <Button variant="outlined" style={{ color: 'white' }} component="span">
                Upload Vaccination Card*
              </Button>
              {isMobile ? <br /> : null}
              {vaccinationFile !== undefined && (
                <text style={{ marginLeft: isMobile ? '0rem' : '1rem', color: 'white' }}>
                  {'Uploaded:' + vaccinationFile.name}
                </text>
              )}
            </label>
          </Grid>
          <Grid item xs={12}>
            {resume}
            {vaccination}
            {codeOfConduct}
            {eventLogistics}
            {communication}
          </Grid>
        </Grid>

        <Typography class="card-text-red">{profileSubmitMsg}</Typography>

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
            handleProfileNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );

  return <div>{profileCard}</div>;
}
