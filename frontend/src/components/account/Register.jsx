import React, { useState } from "react";
import axios from "axios";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { Link } from "react-router-dom";
import MajorAutocomplete from "./MajorAutocomplete"
import SchoolAutocomplete from "./SchoolAutocomplete"

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

  // decide which step is actively showing
  const [activeStep, setActiveStep] = useState(0);
  const stepHeader = ['Account Information', 'Personal Information', 'Confirm Email'];


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

      setConfirmMsg("* Required Field cannot be empty")
      return;
    }
    const emailre = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailre.test(String(username).toLowerCase())) {
      setConfirmMsg("Please enter a valid email address")
      return;
    }

    const response = await axios.get('/api/accounts/check/' + username)
    if (response.data.exist) {
      setConfirmMsg("Email is already used")
      return;
    }

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setConfirmMsg("Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character")
      return;
    }

    if (password !== passwordConfirm) {
      setConfirmMsg("Confirm password must match with the password")
      return;
    }
    //go to the next step    
    setActiveStep(activeStep + 1);
  };

  async function handleProfileNext() {

    if (username.length === 0 || password.length === 0 || first_name.length === 0 || last_name.length === 0 || gender.length === 0 || major.length === 0 || school.length === 0 || ethnicity.length === 0 || grad.length === 0 || grad_month === 0 || grad_year === 0) {
      setProfileSubmitMsg("* Required Field cannot be empty")
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
    //go to the next step   
    setActiveStep(activeStep + 1);
  };

  const account = (
    <Grid container direction={"column"} spacing={2}>
      <Grid item>
        <TextField required id="standard-basic" variant="outlined" label="Email Address" onChange={e => setUsername(e.target.value)} />
      </Grid>

      <Grid item>
        <TextField type={'password'} required id="standard-basic" variant="outlined" label="Password" onChange={e => setPassword(e.target.value)} />
      </Grid>
      <Grid item>
        <TextField type={'password'} required id="standard-basic" variant="outlined" label="Confirm Password" onChange={e => setPasswordConfirm(e.target.value)} />
        <Typography style={{ color: "red" }}>
          {confirmMsg}
        </Typography>
      </Grid>

    </Grid>
  );
  const personalInfo = (
    <Grid container direction={"column"} spacing={2}>
      <Grid item>
        <TextField required id="standard-basic" variant="outlined" label="First Name" onChange={e => setFirst_name(e.target.value)} />
      </Grid>
      <Grid item>
        <TextField required id="standard-basic" variant="outlined" label="Last Name" onChange={e => setLast_name(e.target.value)} />
      </Grid>
      <Grid item>
        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel >Gender</InputLabel>
          <Select
            onChange={(e) => {
              setGender(e.target.value);
            }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Non-Binary">Non-Binary</MenuItem>
            <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel >Ethnicity</InputLabel>
          <Select
            onChange={(e) => {
              setEthnicity(e.target.value);
            }}
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
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <SchoolAutocomplete
            school={school}
            setSchool={setSchool} />
        </FormControl>
        <Typography style={{fontSize: '12px', color:"grey"}}>
          * If your school is not in the list, choose 'other schools'
        </Typography>
      </Grid>

      <Grid item>
        <MajorAutocomplete
          major={major}
          setMajor={setMajor} />
        <Typography style={{fontSize: '12px', color:"grey"}}>
          * If your major is not in the list, choose 'other majors'
        </Typography>
      </Grid>

      <Grid item>
        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel >Program</InputLabel>
          <Select
            onChange={(e) => {
              setGrad(e.target.value);
            }}
          >
            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
            <MenuItem value="Graduate">Graduate</MenuItem>
            <MenuItem value="Postgraduate">Postgraduate</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item>
        <TextField id="standard-basic" variant="outlined" label="Phone Number" onChange={e => setPhone_number(e.target.value)} />
      </Grid>

      <Grid item>
        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel id="demo-simple-select-label">Graduation Month</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              setGrad_month(e.target.value);
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
          </Select>
        </FormControl>

        <FormControl required variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel id="demo-simple-select-label">Graduation Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            onChange={(e) => {
              setGrad_year(e.target.value);
            }}
          >
            <MenuItem value="2020">2020</MenuItem>
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2022">2022</MenuItem>
            <MenuItem value="2023">2023</MenuItem>
            <MenuItem value="2024">2024</MenuItem>
            <MenuItem value="2025">2025</MenuItem>
          </Select>
        </FormControl>
        <Typography style={{ color: "red" }}>
          {profileSubmitMsg}
        </Typography>
      </Grid>

    </Grid >
  );

  function selectStep(index) {
    if (index === 0) {
      return (
        <>
          {account}
          <div className={classes.actionsContainer}>
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
          </div>
        </>
      )
    }
    else if (index === 1) {
      return (
        <>
          {personalInfo}
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleProfileNext();
              }}
              className={classes.button}
            >
              Create Account
                    </Button>
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <Typography>
            You should have recieved a confirmation email. Please check your inbox (and spam) and click the link to confirm your email address. Your application to HopHacks will be complete after email confirmation!
                  </Typography>
          <div className={classes.actionsContainer}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              component={Link} to={'/profile'}
            >
              Login
                    </Button>
          </div>
        </>
      )
    }

  }

  const VerticalLinearStepper = (

    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {stepHeader.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {selectStep(activeStep)}
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );


  return (
    <Container fixed>
      {VerticalLinearStepper}
    </Container>
  )
}
