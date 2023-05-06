import React, { useState } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import MajorAutocomplete from '../../account/MajorAutocomplete';
import SchoolAutocomplete from '../../account/SchoolAutocomplete';
import Checkbox from '@material-ui/core/Checkbox';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneNumber from '../../account/PhoneNumber';

import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import '../../../stylesheets/register.css';
import { useEffect } from 'react';

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
    
    const resume = props.resume;
    const codeOfConduct = props.codeOfConduct;
    const eventLogistics = props.eventLogistics;
    const communication = props.communication;

    const profileSubmitMsg = props.profileSubmitMsg;
    const enabledButton = props.enabledButton;
    const setEnabledButton = props.setEnabledButton;

    const handleProfileNext = props.handleProfileNext;

    const personalInfo = (
        <Grid container>
          <Grid
            container
            item
            spacing={2}
            sm={12}
            md={7}
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid container item spacing={0} xs={12}>
              <Grid item xs={5}>
                <TextField
                  required
                  id="standard-basic"
                  variant="standard"
                  label="First Name"
                  onChange={(e) => setFirst_name(e.target.value)}
                  style={{ minWidth: 145, maxWidth: 145 }}
                  InputLabelProps={{
                    style: { color: '#000000' },
                  }}
                />
              </Grid>
    
              <Grid item xs={7}>
                <TextField
                  required
                  id="standard-basic"
                  variant="standard"
                  label="Last Name"
                  onChange={(e) => setLast_name(e.target.value)}
                  style={{ minWidth: 145, maxWidth: 145 }}
                  InputLabelProps={{
                    style: { color: '#000000' },
                  }}
                />
              </Grid>
            </Grid>
    
            <Grid container item spacing={0} xs={12}>
              <Grid item xs={5}>
                <TextField
                  required
                  id="standard-basic"
                  variant="standard"
                  type="number"
                  label="Age"
                  onChange={(e) => setAge(e.target.value)}
                  style={{ minWidth: 145, maxWidth: 145 }}
                  InputProps={{ inputProps: { min: 0 } }}
                  InputLabelProps={{
                    style: { color: '#000000' },
                  }}
                />
              </Grid>
    
              <Grid item xs={7}>
                <TextField
                  required
                  variant="standard"
                  label="Gender"
                  style={{ minWidth: 145, maxWidth: 145 }}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                  select
                  InputLabelProps={{
                    style: { color: '#000000' },
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                  <MenuItem value="Transgender">Transgender</MenuItem>
                  <MenuItem value="Intersex">Intersex</MenuItem>
                  <MenuItem value="Not listed">Not listed</MenuItem>
                  <MenuItem value="Prefer not to disclose">
                    Prefer not to disclose
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>
    
            <Grid item xs={12}>
              <TextField
                required
                variant="standard"
                label="Ethnicity"
                style={{ minWidth: 300, maxWidth: 300 }}
                onChange={(e) => {
                  setEthnicity(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#000000' },
                }}
              >
                <MenuItem value="American Indian or Alaska Native">
                  American Indian or Alaska Native
                </MenuItem>
                <MenuItem value="Asian">Asian</MenuItem>
                <MenuItem value="Black or African American">
                  Black or African American
                </MenuItem>
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
                <MenuItem value="Prefer not to disclose">
                  Prefer not to disclose
                </MenuItem>
              </TextField>
            </Grid>
    
            <Grid item xs={12}>
              <PhoneInput
                international
                withCountryCallingCode
                defaultCountry="US"
                onChange={setPhone_number}
                inputComponent={PhoneNumber}
                value={props.phone_number}
              />
            </Grid>
          </Grid>
    
          <Grid
            container
            spacing={0}
            xs={6}
            md={5}
            direction="row"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <FormControl
                required
                variant="standard"
                style={{ minWidth: 300, maxWidth: 300 }}
              >
                <SchoolAutocomplete school={school} setSchool={setSchool} />
              </FormControl>
              <FormHelperText style={{ fontSize: 9, color: 'black', width: 300 }}>
                * If your school is not in the list, choose 'other schools'
              </FormHelperText>
            </Grid>
    
            <Grid item xs={12}>
              <MajorAutocomplete major={major} setMajor={setMajor} />
              <FormHelperText style={{ fontSize: 9, color: 'black', width: 300 }}>
                * If your major is not in the list, choose 'other majors'
              </FormHelperText>
            </Grid>
    
            <Grid item xs={12}>
              <TextField
                required
                variant="standard"
                label="Program"
                style={{ minWidth: 300, marginTop: -5.5, maxWidth: 300 }}
                onChange={(e) => {
                  setGrad(e.target.value);
                }}
                select
                InputLabelProps={{
                  style: { color: '#000000' },
                }}
              >
                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Postgraduate">Postgraduate</MenuItem>
              </TextField>
            </Grid>
    
            <Grid
              container
              item
              xs={12}
              direction="row"
              alignItems="center"
              justify="center"
            >
              <Grid item xs={11} md={7}>
                <TextField
                  required
                  variant="standard"
                  label="Grad Month"
                  style={{
                    minWidth: 145,
                    marginTop: 10,
                    maxWidth: 145,
                    marginBottom: -3,
                  }}
                  onChange={(e) => {
                    setGrad_month(e.target.value);
                  }}
                  select
                  InputLabelProps={{
                    style: { color: '#000000' },
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
    
              <Grid item xs={1} md={5}>
                <TextField
                  required
                  variant="standard"
                  label="Grad Year"
                  style={{
                    minWidth: 145,
                    marginLeft: -12,
                    marginTop: 10,
                    maxWidth: 145,
                    marginBottom: -3,
                  }}
                  onChange={(e) => {
                    setGrad_year(e.target.value);
                  }}
                  select
                  InputLabelProps={{
                    style: { color: '#000000' },
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
          </Grid>
    
          <Grid item xs={12}>
            {resume}
            {codeOfConduct}
            {eventLogistics}
            {communication}
          </Grid>
    
          <Grid
            item
            container
            xs={12}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <Typography style={{ color: 'red' }}>{profileSubmitMsg}</Typography>
            </Grid>
    
            <Grid item>
              <Button
                variant="contained"
                justifyContent="center"
                color="primary"
                size="large"
                disabled={!enabledButton}
                onClick={() => {
                  handleProfileNext();
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );

    const profileCard = (
        <Card class="card">
            <CardContent>
                <Typography class="card-title">
                    Create Profile
                </Typography>
                {personalInfo}
            </CardContent>
        </Card>
    );

    return (
        <div>
            {profileCard}
        </div>
    );
}
