import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MajorAutocomplete from '../../account/MajorAutocomplete';
import SchoolAutocomplete from '../../account/SchoolAutocomplete';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import PhoneNumber from '../../account/PhoneNumber';

import '../../../stylesheets/user_auth.css';

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

  const profileSubmitMsg = props.profileSubmitMsg;
  const enabledButton = props.enabledButton;

  const handleImageNext = props.handleImageNext;
  const handleImageBack = props.handleImageBack;

  const profileCard = (
    <Card class="card">
      <CardContent>
        <Typography class={isMobile ? 'mobile-header' : 'card-title'}>IMAGE HERE</Typography>
        <Typography class={isMobile ? 'mobile-subheader' : 'card-subtitle'}>
          step 1: basic info
        </Typography>
        <Typography class={isMobile ? 'mobile-infoline' : 'card-infoline'}>
          help us learn more about you!
        </Typography>
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
            handleImageBack();
          }}
        >
          Back
        </Button>

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
            handleImageNext();
          }}
        >
          Next
        </Button>
      </CardContent>
    </Card>
  );

  return <div>{profileCard}</div>;
}
