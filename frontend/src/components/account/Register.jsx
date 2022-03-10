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


import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';


import '../../stylesheets/register.css';
import img from "./temp.png";

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
  // const stepHeader = ['Account Information', 'Personal Information', 'Confirm Email'];

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
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

    if (username.length === 0 || password.length === 0 || first_name.length === 0 || last_name.length === 0 || gender.length === 0 || major.length === 0 || school.length === 0 || ethnicity.length === 0 || grad.length === 0 || grad_month === 0 || grad_year === 0) {
      setProfileSubmitMsg("* Required field cannot be empty.")
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
    setActiveStep(1);
  };

  const account = (
    <Grid
      container
      spacing={4}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '35em', maxHeight: '65em' }}
    >
      <Grid item xs={0} md={1} lg={1} />
      <Grid item xs={12} md={5} lg={5} align="center">
        <img id="graphic" src={img} width="100%" />
      </Grid>
      <Grid id="register" item xs={12} md={5} lg={5} align="center">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Register</h1>
          </Grid>
          <Grid item xs={12}>
            <TextField required id="standard-basic" variant="outlined" label="Email Address" onChange={e => setUsername(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField type={'password'} required id="standard-basic" variant="outlined" label="Password" onChange={e => setPassword(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField type={'password'} required id="standard-basic" variant="outlined" label="Confirm Password" onChange={e => setPasswordConfirm(e.target.value)} />
            <Typography style={{ color: "red" }}>
              {confirmMsg}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAccountNext();
              }}
              className={classes.button}
            >
              Next
            </Button>
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
    // <Typography style={{ fontSize: '14px', marginTop: '10px' }}>
    //   <Checkbox
    //     checked={conductCodeChecked}
    //     onChange={handleConductCheckBox}
    //     inputProps={{ 'aria-label': 'primary checkbox' }}
    //     color="primary"
    //   />
    //   I have read and understand the {' '}
    //   <Link onClick={openCodeOfConduct}>
    //     MLH code of conduct
    //   </Link> *
    // </Typography>

    <FormGroup>
      <FormControlLabel
        control={
          <
            Checkbox checked={conductCodeChecked}
            onChange={handleConductCheckBox}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
          />
        }
        label={
          <div>
            <span>I have read and understand the </span>
            <Link onClick={openCodeOfConduct}>
              MLH code of conduct
            </Link>
            <span> *</span>
          </div>
        }
      />
    </FormGroup>
  )
  const eventLogistics = (
    // <Typography style={{ fontSize: '14px' }}>
    //   <Checkbox
    //     checked={eventLogisticsChecked}
    //     onChange={handleLogisticsCheckBox}
    //     inputProps={{ 'aria-label': 'primary checkbox' }}
    //     color="primary"
    //   />
    //   I authorize you to share my
    //   application/registration information with Major League Hacking for event
    //   administration, ranking, and MLH administration in-line with the <Link onClick={openPrivacy}>
    //     MLH Privacy Policy
    //   </Link>. I further agree to the terms of both the <Link onClick={openTerms}>
    //     MLH Terms and Conditions
    //   </Link> and the <Link onClick={openPrivacy}>
    //     MLH Privacy Policy
    //   </Link>
    //    . *
    // </Typography>

    <FormGroup>
      <FormControlLabel
        style={{ display:'table'}}
        control={
          <div style={{display:'table-cell'}}>
          <
            Checkbox checked={eventLogisticsChecked}
            onChange={handleLogisticsCheckBox}
            inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
          />
        </div>
        }
        label={
          <div>
            <span>I authorize you to share my application/registration information 
              with Major League Hacking for event administration, ranking, and MLH 
              administration in-line with the </span>
            <Link onClick={openPrivacy}>
              MLH Privacy Policy
            </Link>
            <span> I further agree to the </span>
            <Link onClick={openTerms}>
              MLH Terms and Conditions
            </Link>
            <span> *</span>
          </div>
        }
      />
    </FormGroup>
  )
  const communication = (
//     <Typography style={{ fontSize: '14px' }}>
//       <Checkbox
//         checked={communicationChecked}
//         onChange={handleCommunicationCheckBox}
//         inputProps={{ 'aria-label': 'primary checkbox' }}
//         color="primary"
//       />
//       I authorize MLH to send me pre- and
// post-event informational emails, which contain free credit and
// opportunities from their partners. *
//     </Typography>

  <FormGroup>
    <FormControlLabel
      style={{ display:'table'}}
      control={
        <div style={{display:'table-cell'}}>
        <
          Checkbox checked={communicationChecked}
          onChange={handleCommunicationCheckBox}
          inputProps={{ 'aria-label': 'primary checkbox' }}
          color="primary"
        />
      </div>
      }
      label={
        <div>
          <span>I authorize MLH to send me pre- and post-event informational emails, 
            which contain free credit and opportunities from their partners. *</span>
        </div>
      }
    />
  </FormGroup>
  )

  const personalInfo = (
    <Grid container spacing={2}>
      <Grid container item spacing={2} xs={12} md={6}>
        <Grid item xs={12}>
          <TextField required id="standard-basic" variant="outlined" label="First Name" onChange={e => setFirst_name(e.target.value)} style={{ minWidth: 250 }} />
        </Grid>

        <Grid item xs={12}>
          <TextField required id="standard-basic" variant="outlined" label="Last Name" onChange={e => setLast_name(e.target.value)} style={{ minWidth: 250 }} />
        </Grid>

        <Grid item xs={12}>
          <TextField required variant="outlined" label="Gender" style={{ minWidth: 250 }}
            onChange={(e) => {
              setGender(e.target.value);
            }}
            select
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Non-Binary">Non-Binary</MenuItem>
            <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField required variant="outlined" label="Ethnicity" style={{ minWidth: 250, maxWidth: 250 }}
            onChange={(e) => {
              setEthnicity(e.target.value);
            }}
            select
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
          <TextField id="standard-basic" variant="outlined" label="Phone Number" onChange={e => setPhone_number(e.target.value)} style={{ minWidth: 250 }} />
        </Grid>
      </Grid>

      <Grid container item spacing={2} xs={12} md={6}>
        <Grid item xs={12}>
          <FormControl required variant="outlined" style={{ minWidth: 250 }}>
            <SchoolAutocomplete
              school={school}
              setSchool={setSchool} />
          </FormControl>
          <Typography style={{ fontSize: '12px', color: "grey" }}>
            * If your school is not in the list, choose 'other schools'
        </Typography>
        </Grid>

        <Grid item xs={12}>
          <MajorAutocomplete
            major={major}
            setMajor={setMajor} />
          <Typography style={{ fontSize: '12px', color: "grey" }}>
            * If your major is not in the list, choose 'other majors'
        </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField required variant="outlined" label="Program" style={{ minWidth: 250 }}
            onChange={(e) => {
              setGrad(e.target.value);
            }}
            select
          >
            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
            <MenuItem value="Graduate">Graduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField required variant="outlined" label="Grad Month" style={{ minWidth: 120 }}
            onChange={(e) => {
              setGrad_month(e.target.value);
            }}
            select
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

        <Grid item xs={6}>
          <TextField required variant="outlined" label="Grad Year" style={{ minWidth: 120 }}
            onChange={(e) => {
              setGrad_year(e.target.value);
            }}
            select
          >
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {codeOfConduct}
        {eventLogistics}
        {communication}
      </Grid>

      <Grid item xs={12}>
        <Typography style={{ color: "red" }}>
          {profileSubmitMsg}
        </Typography>
      </Grid>
      
      <Grid item xs={12}>
        <Button
          variant="contained"
          justifyContent="center"
          color="primary"
          onClick={() => {
            handleProfileNext();
          }}
          className={classes.button}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
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
          {personalInfo}
        </>
      )
    } else {
      return (
        <>
        </>
      )
    }

  }

  return (
    <div class="container">
      <div className="register-wrapper">
        {selectPage()}
      </div>
    </div>
  )
}
