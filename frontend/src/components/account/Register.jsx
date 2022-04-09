import React, { useState } from "react";
import axios from "axios";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import MajorAutocomplete from "./MajorAutocomplete"
import SchoolAutocomplete from "./SchoolAutocomplete"
import CodeOfConduct from "../../doc/mlh-code-of-conduct.pdf"
import Checkbox from '@material-ui/core/Checkbox';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input'
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import PhoneNumber from './PhoneNumber'

import '../../stylesheets/register.css';

export default function Register() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [confirmMsg, setConfirmMsg] = useState("")
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [gender, setGender] = useState("");
  const [major, setMajor] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [school, setSchool] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [grad, setGrad] = useState("");
  const [grad_month, setGrad_month] = useState("");
  const [grad_year, setGrad_year] = useState("");
  const [profileSubmitMsg, setProfileSubmitMsg] = useState("");
  const [conductCodeChecked, setConductCodeChecked] = useState(false)
  const [eventLogisticsChecked, setEventLogisticsChecked] = useState(false)
  const [communicationChecked, setCommunicationChecked] = useState(false)

  // decide which step is actively showing
  const [activeStep, setActiveStep] = useState(0);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontSize: 'min(max(calc(6px + 1.25vw), 3vw), 25px)',
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    label: {
      backgroundColor: 'rgb(232, 235, 242)',
    }
  }));

  const classes = useStyles();

  async function handleAccountNext() {
    if (password.length === 0 || passwordConfirm.length === 0 || username.length === 0) {

      setConfirmMsg("* Required field cannot be empty")
      return;
    }

    const emailre = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailre.test(String(username).toLowerCase())) {
      setConfirmMsg("Please enter a valid email address.")
      return;
    }

    const response = await axios.get('/api/accounts/check/' + username)
    if (response.data.exist) {
      setConfirmMsg("Email is already in use.")
      return;
    }

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setConfirmMsg("Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.")
      return;
    }

    if (password !== passwordConfirm) {
      setConfirmMsg("Confirm password must match with the password.")
      return;
    }

    // Go to the profile page  
    setActiveStep(1);
  };

  async function handleProfileNext() {

    if (username.length === 0 || password.length === 0 || first_name.length === 0 || last_name.length === 0 || gender.length === 0 || major.length === 0 || school.length === 0 || ethnicity.length === 0 || phone_number === undefined || phone_number.length === 0 || grad.length === 0 || grad_month === 0 || grad_year === 0) {
      setProfileSubmitMsg("* Required field cannot be empty.")
      return;
    }

    if (!isPossiblePhoneNumber(phone_number) || !isValidPhoneNumber(phone_number)) {
      setProfileSubmitMsg("* Please enter a valid phone number.")
      return;
    }

    if (!conductCodeChecked) {
      setProfileSubmitMsg("* Please read the MLH Code of Conduct.")
      return;
    }

    if (!eventLogisticsChecked) {
      setProfileSubmitMsg("* Please read the MLH Terms and Conditions and Privacy Policy.")
      return;
    }

    if (!communicationChecked) {
      setProfileSubmitMsg("* Please check the box for MLH informational emails.")
      return;
    }

    try {
      await axios.post('/api/accounts/create', {
        "username": username,
        "password": password,
        "confirm_url": window.location.protocol + '//' + window.location.host + '/confirm_email',
        "profile": {
          "first_name": first_name,
          "last_name": last_name,
          "gender": gender,
          "major": major,
          "phone_number": phone_number,
          "school": school,
          "ethnicity": ethnicity,
          "grad": grad,
          "is_jhu": school === "Johns Hopkins University" ? true : false,
          "grad_month": grad_month,
          "grad_year": grad_year,
        }
      })
    }
    catch (e) {
      return;
    }

    // Go to the confirmation page
    setActiveStep(2);
  };

  const account = (
    <Grid
      container
      spacing={4}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '35rem' }}
    >
      <Grid item xs={0} md={1} lg={1} />
      <Grid item xs={12} md={5} lg={5} align="center">
        <img id="graphic" src={`${process.env.PUBLIC_URL}/images/graphic.png`} width="100%" />
      </Grid>
      <Grid id="register" item xs={12} md={5} lg={5} align="center">
        <Grid container>
          <Grid item xs={12}>
            <h4 style={{ marginBottom: 15 }}>Register</h4>
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required id="standard-basic"
                variant="standard"
                label="Email Address"
                style={{ minWidth: 275 }}
                onChange={e => setUsername(e.target.value)}
                InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type={'password'}
                required id="standard-basic"
                variant="standard"
                label="Password"
                style={{ minWidth: 275 }}
                onChange={e => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type={'password'}
                required id="standard-basic"
                variant="standard"
                label="Confirm Password"
                style={{ minWidth: 275, marginBottom: 25 }}
                onChange={e => setPasswordConfirm(e.target.value)}
                InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
              />
              <Typography style={{ color: "red" }}>
                {confirmMsg}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  handleAccountNext();
                }}
              >
                Next
            </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={0} md={1} lg={1} />
    </Grid>
  );
  const handleConductCheckBox = (event) => {
    setConductCodeChecked(event.target.checked);
  };

  const handleLogisticsCheckBox = (event) => {
    setEventLogisticsChecked(event.target.checked);
  };

  const handleCommunicationCheckBox = (event) => {
    setCommunicationChecked(event.target.checked);
  };

  function openCodeOfConduct() {
    window.open(CodeOfConduct);
  }
  function openPrivacy() {
    window.open("https://mlh.io/privacy", "_blank");
  }
  function openTerms() {
    window.open("https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md", "_blank");
  }


  const codeOfConduct = (
    <FormGroup style={{ marginTop: 50 }}>
      <FormControlLabel
        control={
          <
            Checkbox checked={conductCodeChecked}
            onChange={handleConductCheckBox}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
            size="small"
          />
        }
        label={
          <div style={{ fontSize: 15 }}>
            <span>I have read and understand the </span>
            <Link onClick={openCodeOfConduct}>
              MLH code of conduct
            </Link>
            <span>. *</span>
          </div>
        }
      />
    </FormGroup>
  )

  const eventLogistics = (
    <FormGroup style={{ marginTop: -10 }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <
              Checkbox checked={eventLogisticsChecked}
              onChange={handleLogisticsCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15 }}>
            <span>I authorize you to share my application/registration information
            with Major League Hacking for event administration, ranking, and MLH
              administration in-line with the </span>
            <Link onClick={openPrivacy}>
              MLH Privacy Policy
            </Link>
            <span>. I further agree to the </span>
            <Link onClick={openTerms}>
              MLH Terms and Conditions
            </Link>
            <span>. *</span>
          </div>
        }
      />
    </FormGroup>
  )
  const communication = (
    <FormGroup style={{ marginTop: -10, marginBottom: 25 }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <
              Checkbox checked={communicationChecked}
              onChange={handleCommunicationCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15 }}>
            <span>I authorize MLH to send me pre- and post-event informational emails,
              which contain free credit and opportunities from their partners. *</span>
          </div>
        }
      />
    </FormGroup>
  )

  const personalInfo = (
    <Grid container>
      <Grid container item spacing={2} sm={12} md={7} direction="row" alignItems="center" justify="center">
        <Grid container item spacing={0} xs={12}>
          <Grid item xs={5}>
            <TextField
              required id="standard-basic"
              variant="standard"
              label="First Name"
              onChange={e => setFirst_name(e.target.value)}
              style={{ minWidth: 145, maxWidth: 145 }}
              InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
            />
          </Grid>

          <Grid item xs={7}>
            <TextField
              required id="standard-basic"
              variant="standard"
              label="Last Name"
              onChange={e => setLast_name(e.target.value)}
              style={{ minWidth: 145, maxWidth: 145 }}
              InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
            />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required variant="standard"
            label="Gender"
            style={{ minWidth: 300, maxWidth: 300 }}
            onChange={(e) => {
              setGender(e.target.value);
            }}
            select
            InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
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

        <Grid item xs={12}>
          <TextField
            required variant="standard"
            label="Ethnicity"
            style={{ minWidth: 300, maxWidth: 300 }}
            onChange={(e) => {
              setEthnicity(e.target.value);
            }}
            select
            InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
          >
            <MenuItem value="American Indian or Alaska Native">American Indian or Alaska Native</MenuItem>
            <MenuItem value="Asian">Asian</MenuItem>
            <MenuItem value="Black or African American">Black or African American</MenuItem>
            <MenuItem value="Hispanic, Latino or Spanish Origin">Hispanic, Latino or Spanish Origin</MenuItem>
            <MenuItem value="Middle Eastern or North African">Middle Eastern or North African</MenuItem>
            <MenuItem value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</MenuItem>
            <MenuItem value="White">White</MenuItem>
            <MenuItem value="Multiethnic">Multiethnic</MenuItem>
            <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <PhoneInput
            international
            withCountryCallingCode
            onChange={setPhone_number}
            inputComponent={PhoneNumber}
          />
        </Grid>
      </Grid>

      <Grid container spacing={0} xs={6} md={5} direction="row" alignItems="center" justify="center">
        <Grid item xs={12}>
          <FormControl
            required variant="standard"
            style={{ minWidth: 300, maxWidth: 300 }}
          >
            <SchoolAutocomplete
              school={school}
              setSchool={setSchool} />
          </FormControl>
          <FormHelperText style={{ fontSize: 9, color: "black", width: 300 }}>
            * If your school is not in the list, choose 'other schools'
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <MajorAutocomplete
            major={major}
            setMajor={setMajor} />
          <FormHelperText style={{ fontSize: 9, color: "black", width: 300 }}>
            * If your major is not in the list, choose 'other majors'
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required variant="standard"
            label="Program"
            style={{ minWidth: 300, marginTop: -5.5, maxWidth: 300 }}
            onChange={(e) => {
              setGrad(e.target.value);
            }}
            select
            InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
          >
            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
            <MenuItem value="Graduate">Graduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
          </TextField>
        </Grid>

        <Grid container item xs={12} direction="row" alignItems="center" justify="center">
          <Grid item xs={11} md={7}>
            <TextField
              required variant="standard"
              label="Grad Month"
              style={{ minWidth: 145, marginTop: 10, maxWidth: 145, marginBottom: -3 }}
              onChange={(e) => {
                setGrad_month(e.target.value);
              }}
              select
              InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
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
              required variant="standard"
              label="Grad Year"
              style={{ minWidth: 145, marginLeft: -12, marginTop: 10, maxWidth: 145, marginBottom: -3 }}
              onChange={(e) => {
                setGrad_year(e.target.value);
              }}
              select
              InputLabelProps={{ style: { color: '#000000' }, classes: { root: classes.label } }}
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
        {codeOfConduct}
        {eventLogistics}
        {communication}
      </Grid>

      <Grid item container xs={12} direction="column" alignItems="center" justify="center">
        <Grid item>
          <Typography style={{ color: "red" }}>
            {profileSubmitMsg}
          </Typography>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            justifyContent="center"
            color="primary"
            size="large"
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

  const confirmation = (
    <div style={{ textAlign: "center" }}>
      <h1>Thank you!</h1>
      <h3>A confirmation has been sent to your email.</h3>
      <Typography>Please check your inbox (and spam) and click the link to confirm your email address.</Typography>
      <Typography>Your application to HopHacks will be complete after email confirmation!</Typography>
    </div>
  );

  function selectPage() {
    if (activeStep === 0) {
      return (
        <>
          {account}
        </>
      )
    } else if (activeStep === 1) {
      return (
        <>
          <div class="personal-wrapper">
            {personalInfo}
          </div>
        </>
      )
    } else {
      return (
        <>
          {confirmation}
        </>
      )
    }

  }

  return (
    <body style={{
      backgroundImage: `url("${process.env.PUBLIC_URL}/images/2021_theme.png")`
    }}>
      <div class="container">
        <div className="register-wrapper">
          {selectPage()}
        </div>
      </div>
    </body>
  )
}
