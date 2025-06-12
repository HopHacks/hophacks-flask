import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import MajorAutocomplete from './MajorAutocomplete';
import SchoolAutocomplete from './SchoolAutocomplete';
import CountryAutocomplete from './CountryAutocomplete';

import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import PhoneNumber from '../account/PhoneNumber';

//import Login from '../Login';
//import { useHistory } from 'react-router-dom';

import '../../stylesheets/user_auth.css';

//users with accounts from previous years
export default function ProfileOldUser(props) {
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
  const setOtherSchool = props.setOtherSchool;
  const setGrad_month = props.setGrad_month;
  const setGrad_year = props.setGrad_year;
  const setCountry = props.setCountry;
  const profileSubmitMsg = props.profileSubmitMsg;
  const enabledButton = props.enabledButton;

  const handleProfileNext = props.handleProfileNext;

  const profileCard = (
    <Card>
      <CardContent>
        <Typography className={isMobile ? 'mobile-header' : 'card-title'}>Welcome Back</Typography>
        <Typography className={isMobile ? 'mobile-subheader' : 'card-subtitle'}>
          Please verify all of your information from last year is still accurate!
        </Typography>
        <Typography className={isMobile ? 'mobile-infoline' : 'card-infoline'}>
          Be sure to fill out any new fields, and upload your latest resume on the next page.
        </Typography>
        <Grid container spacing={isMobile ? 2 : 5}>
          <Grid item xs={isMobile ? 12 : 5}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                value={props.first_name}
                label="First Name"
                style={{ width: '100%' }}
                onChange={(e) => setFirst_name(e.target.value)}
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              />
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 5}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Last Name"
                value={props.last_name}
                style={{ width: '100%' }}
                onChange={(e) => setLast_name(e.target.value)}
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              />
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 2}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                type="number"
                label="Age"
                value={props.age}
                style={{ width: '100%' }}
                onChange={(e) => setAge(e.target.value)}
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' },
                  inputProps: { min: 0 }
                }}
              />
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Gender"
                value={props.gender}
                style={{ width: '100%' }}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
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
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Ethnicity"
                value={props.ethnicity}
                style={{ width: '100%' }}
                onChange={(e) => {
                  setEthnicity(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
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
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <PhoneInput
                international
                withCountryCallingCode
                onChange={setPhone_number}
                inputComponent={PhoneNumber}
                value={phone_number}
              />
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 6}>
            <div className="text-field">
              <FormControl required variant="standard" style={{ width: '100%' }}>
                <SchoolAutocomplete school={school} setSchool={setSchool} />
              </FormControl>
            </div>
            <FormHelperText style={{ fontSize: 9, color: '#061A40', width: '100%' }}>
              * If your school is not in the list, choose &apos;other schools&apos;
            </FormHelperText>
          </Grid>
          {props.school === 'Other Schools' && (
            <Grid item xs={isMobile ? 12 : 6}>
              <div className="text-field">
                <TextField
                  variant="standard"
                  label="Other School"
                  value={props.otherSchool}
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    setOtherSchool(e.target.value);
                  }}
                />
              </div>
            </Grid>
          )}
          <Grid item xs={isMobile ? 12 : 6}>
            <div className="text-field">
              <MajorAutocomplete major={major} setMajor={setMajor} />
            </div>
            <FormHelperText style={{ fontSize: 9, color: '#061A40', width: '100%' }}>
              * If your major is not in the list, choose &apos;other majors&apos;
            </FormHelperText>
          </Grid>

          <Grid item xs={isMobile ? 12 : 6}>
            <div className="text-field">
              <FormControl required variant="standard" style={{ width: '100%' }}>
                <CountryAutocomplete setCountry={setCountry} country={props.country} />
              </FormControl>
            </div>
            {/* <FormHelperText style={{ fontSize: 9, color: '#061A40', width: '100%' }}>
              * If your school is not in the list, choose &apos;other schools&apos;
            </FormHelperText> */}
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Level of Study"
                value={props.grad}
                style={{ width: '100%' }}
                onChange={(e) => {
                  setGrad(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              >
                <MenuItem value="Undergraduate University (2 year - community college or similar)">
                  Undergraduate University (2 year - community college or similar)
                </MenuItem>
                <MenuItem value="Undergraduate University (3+ year)">
                  Undergraduate University (3+ year)
                </MenuItem>
                <MenuItem value="Graduate University (Masters, Professional, Doctoral, etc)">
                  Graduate University (Masters, Professional, Doctoral, etc)
                </MenuItem>
                <MenuItem value="Code School / Bootcamp">Code School / Bootcamp</MenuItem>
                <MenuItem value="Other Vocational / Trade Program or Apprenticeship">
                  Other Vocational / Trade Program or Apprenticeship
                </MenuItem>
                <MenuItem value="Post Doctorate">Post Doctorate</MenuItem>
                <MenuItem value="Other">Other </MenuItem>
              </TextField>
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Grad Month"
                style={{ width: '100%' }}
                value={props.grad_month}
                onChange={(e) => {
                  setGrad_month(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
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
            </div>
          </Grid>
          <Grid item xs={isMobile ? 12 : 4}>
            <div className="text-field">
              <TextField
                required
                variant="standard"
                label="Grad Year"
                value={props.grad_year}
                style={{ width: '100%' }}
                onChange={(e) => {
                  setGrad_year(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#061A40' }
                }}
                InputProps={{
                  style: { color: '#061A40' }
                }}
              >
                <MenuItem value="2024">2024</MenuItem>
                <MenuItem value="2025">2025</MenuItem>
                <MenuItem value="2026">2026</MenuItem>
                <MenuItem value="2027">2027</MenuItem>
                <MenuItem value="2028">2028</MenuItem>
                <MenuItem value="2029">2029</MenuItem>
                <MenuItem value="2030">2030</MenuItem>
              </TextField>
            </div>
          </Grid>
        </Grid>

        <Typography class="card-text-red">{profileSubmitMsg}</Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                handleProfileNext();
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
