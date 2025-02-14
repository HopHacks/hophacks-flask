import React, { useState } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import MajorAutocomplete from './MajorAutocomplete';
import SchoolAutocomplete from './SchoolAutocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneNumber from './PhoneNumber';

import '../../stylesheets/register.css';

export default function Register() {
  const [username] = useState('');
  const [password] = useState('');

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }
  // const [passwordConfirm, setPasswordConfirm] = useState('');
  // const [confirmMsg, setConfirmMsg] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [gender, setGender] = useState('');
  const [major, setMajor] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [school, setSchool] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [age, setAge] = useState(0);
  const [grad, setGrad] = useState('');
  const [grad_month, setGrad_month] = useState('');
  const [grad_year, setGrad_year] = useState('');
  const [resumeFile, setResumeFile] = useState('');
  const [profileSubmitMsg, setProfileSubmitMsg] = useState('');
  const [resumeChecked, setResumeChecked] = useState(false);
  const [conductCodeChecked, setConductCodeChecked] = useState(false);
  const [eventLogisticsChecked, setEventLogisticsChecked] = useState(false);
  const [communicationChecked, setCommunicationChecked] = useState(false);
  const [enabledButton, setEnabledButton] = useState(true);

  // decide which page is actively showing
  const ACCOUNT = 0;
  const PROFILE = 1;
  const CONFIRMATION = 2;
  const [activePage, setActivePage] = useState(ACCOUNT);

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
      fontSize: 'min(max(calc(6px + 1.25vw), 3vw), 25px)'
    },
    actionsContainer: {
      marginBottom: theme.spacing(2)
    },
    resetContainer: {
      padding: theme.spacing(3)
    },
    label: {
      backgroundColor: 'rgb(232, 235, 242)'
    }
  }));

  const classes = useStyles();

  function handleResumeFileChange(e) {
    setResumeFile(e.target.files[0]);
  }

  // async function handleAccountNext() {
  //   if (password.length === 0 || passwordConfirm.length === 0 || username.length === 0) {
  //     setConfirmMsg('* Required field cannot be empty');
  //     return;
  //   }

  //   const emailre =
  //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   if (!emailre.test(String(username).toLowerCase())) {
  //     setConfirmMsg('Please enter a valid email address.');
  //     return;
  //   }

  //   const response = await axios.get('/api/accounts/check/' + username);
  //   if (response.data.exist) {
  //     setConfirmMsg('Email is already in use.');
  //     return;
  //   }

  //   const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

  //   if (!password.match(passwordre)) {
  //     setConfirmMsg(
  //       'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.'
  //     );
  //     return;
  //   }

  //   if (password !== passwordConfirm) {
  //     setConfirmMsg('Confirm password must match with the password.');
  //     return;
  //   }

  //   // Go to the profile page
  //   setActivePage(PROFILE);
  // }

  // function isEmpty() {
  //   return (
  //     username.length === 0 ||
  //     password.length === 0 ||
  //     first_name.length === 0 ||
  //     last_name.length === 0 ||
  //     gender.length === 0 ||
  //     major.length === 0 ||
  //     school.length === 0 ||
  //     ethnicity.length === 0 ||
  //     phone_number === undefined ||
  //     phone_number.length === 0 ||
  //     grad.length === 0 ||
  //     grad_month === 0 ||
  //     grad_year === 0
  //   );
  // }

  async function handleProfileNext() {
    if (username.length === 0) {
      setProfileSubmitMsg('* Please enter a valid username.');
      return;
    }
    if (password.length === 0) {
      setProfileSubmitMsg('* Please enter a valid password.');
      return;
    }
    if (first_name.length === 0) {
      setProfileSubmitMsg('* Please enter a valid first name.');
      return;
    }
    if (last_name.length === 0) {
      setProfileSubmitMsg('* Please enter a valid last name.');
      return;
    }
    if (gender.length === 0) {
      setProfileSubmitMsg('* Please select a gender.');
      return;
    }
    if (major.length === 0) {
      setProfileSubmitMsg('* Please select a major.');
    }
    if (school.length === 0) {
      setProfileSubmitMsg('* Please select a school.');
      return;
    }
    if (ethnicity.length === 0) {
      setProfileSubmitMsg('* Please select an ethnicity.');
      return;
    }
    if (phone_number === undefined || phone_number.length === 0) {
      setProfileSubmitMsg('* Please enter a valid phone number.');
      return;
    }
    if (grad.length === 0) {
      setProfileSubmitMsg('* Please select a valid graduation program.');
      return;
    }
    if (grad_month.length === 0) {
      setProfileSubmitMsg('* Please select a valid graduation month.');
      return;
    }
    if (grad_year.length === 0) {
      setProfileSubmitMsg('* Please select a valid graduation year.');
      return;
    }

    if (!isValidPhoneNumber(phone_number)) {
      setProfileSubmitMsg('* Please enter a valid phone number.');
      return;
    }

    if (!resumeChecked || resumeFile === '') {
      setProfileSubmitMsg('* Please upload your resume.');
      return;
    }

    if (!conductCodeChecked) {
      setProfileSubmitMsg('* Please read the MLH Code of Conduct.');
      return;
    }

    if (!eventLogisticsChecked) {
      setProfileSubmitMsg('* Please read the MLH Terms and Conditions and Privacy Policy.');
      return;
    }

    /*if (!communicationChecked) {
      setProfileSubmitMsg("* Please check the box for MLH informational emails.")
      return;
    }*/

    const agere = /^[0-9\b]+$/;
    if (!agere.test(age)) {
      setProfileSubmitMsg('* Age must be an integer value.');
      return;
    }

    const data = new FormData();
    data.append('file', resumeFile);
    data.append(
      'json_file',
      JSON.stringify({
        username: username,
        password: password,
        confirm_url: window.location.protocol + '//' + window.location.host + '/confirm_email',
        profile: {
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          major: major,
          phone_number: phone_number,
          school: school,
          ethnicity: ethnicity,
          grad: grad,
          is_jhu: school === 'Johns Hopkins University' ? true : false,
          grad_month: grad_month,
          grad_year: grad_year,
          mlh_emails: communicationChecked
        }
      })
    );

    try {
      setEnabledButton(false);
      await axios.post('/api/accounts/create', data);

      await axios.post('/api/slack/registration', {
        first_name: first_name,
        last_name: last_name,
        school: school
      });
    } catch (e) {
      return;
    }

    // Go to the confirmation page
    setActivePage(CONFIRMATION);
  }

  // const account = (
  //   <Grid
  //     container
  //     spacing={4}
  //     alignItems="center"
  //     justifyContent="center"
  //     style={{ minHeight: '35rem' }}
  //   >
  //     <Grid item xs={0} md={1} lg={1} />
  //     <Grid item xs={12} md={5} lg={5} align="center">
  //       <img
  //         id="graphic"
  //         src={`https://hophacks-website.s3.amazonaws.com/images/register-graphic.png`}
  //       />
  //     </Grid>
  //     <Grid id="register" item xs={12} md={5} lg={5} align="center">
  //       <Grid container>
  //         <Grid item xs={12}>
  //           <h4 style={{ marginBottom: 15 }}>Register</h4>
  //         </Grid>
  //         <Grid container spacing={1}>
  //           <Grid item xs={12}>
  //             <TextField
  //               required
  //               id="standard-basic"
  //               variant="standard"
  //               label="Email Address"
  //               style={{ minWidth: 275 }}
  //               onChange={(e) => setUsername(e.target.value.toLowerCase())}
  //               InputLabelProps={{
  //                 style: { color: '#000000' },
  //                 classes: { root: classes.label }
  //               }}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <TextField
  //               type={'password'}
  //               required
  //               id="standard-basic"
  //               variant="standard"
  //               label="Password"
  //               style={{ minWidth: 275 }}
  //               onChange={(e) => setPassword(e.target.value)}
  //               InputLabelProps={{
  //                 style: { color: '#000000' },
  //                 classes: { root: classes.label }
  //               }}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <TextField
  //               type={'password'}
  //               required
  //               id="standard-basic"
  //               variant="standard"
  //               label="Confirm Password"
  //               style={{ minWidth: 275, marginBottom: 25 }}
  //               onChange={(e) => setPasswordConfirm(e.target.value)}
  //               InputLabelProps={{
  //                 style: { color: '#000000' },
  //                 classes: { root: classes.label }
  //               }}
  //             />
  //             <Typography style={{ color: 'red' }}>{confirmMsg}</Typography>
  //           </Grid>
  //           <Grid item xs={12}>
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               size="large"
  //               onClick={() => {
  //                 handleAccountNext();
  //               }}
  //             >
  //               Next
  //             </Button>
  //           </Grid>
  //         </Grid>
  //       </Grid>
  //     </Grid>
  //     <Grid item xs={0} md={1} lg={1} />
  //   </Grid>
  // );
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
    <FormGroup style={{ marginTop: 20, display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={resumeChecked}
              onChange={handleResumeCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15 }}>
            <span>
              * I authorize HopHacks to send my resume to our event sponsors for recruiting
              purposes.
            </span>

            <div>
              <input
                accept=".pdf, .doc, .docx"
                type="file"
                name="file"
                onChange={handleResumeFileChange}
              />
            </div>
          </div>
        }
      />
    </FormGroup>
  );

  const codeOfConduct = (
    <FormGroup style={{ marginTop: 20, display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={conductCodeChecked}
              onChange={handleConductCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15 }}>
            <span>* I have read and understand the </span>
            <Link onClick={openCodeOfConduct}>MLH Code of Conduct</Link>
            <span>.</span>
          </div>
        }
      />
    </FormGroup>
  );

  const eventLogistics = (
    <FormGroup style={{ marginTop: -10, display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={eventLogisticsChecked}
              onChange={handleLogisticsCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
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
            <Link onClick={openPrivacy}>MLH Privacy Policy</Link>
            <span>. I further agree to the terms of both the </span>
            <Link onClick={openTerms}>MLH Terms and Conditions</Link>
            <span> and the</span>
            <Link onClick={openPrivacy}> MLH Privacy Policy</Link>
            <span>.</span>
          </div>
        }
      />
    </FormGroup>
  );
  const communication = (
    <FormGroup style={{ marginTop: -10, marginBottom: 25, display: 'initial' }}>
      <FormControlLabel
        style={{ display: 'table' }}
        control={
          <div style={{ display: 'table-cell' }}>
            <Checkbox
              checked={communicationChecked}
              onChange={handleCommunicationCheckBox}
              inputProps={{ 'aria-label': 'primary checkbox' }}
              color="primary"
              size="small"
            />
          </div>
        }
        label={
          <div style={{ fontSize: 15 }}>
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
                classes: { root: classes.label }
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
                classes: { root: classes.label }
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
                classes: { root: classes.label }
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
                classes: { root: classes.label }
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
              classes: { root: classes.label }
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

        <Grid item xs={12}>
          <PhoneInput
            international
            withCountryCallingCode
            defaultCountry="US"
            onChange={setPhone_number}
            inputComponent={PhoneNumber}
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
          <FormControl required variant="standard" style={{ minWidth: 300, maxWidth: 300 }}>
            <SchoolAutocomplete school={school} setSchool={setSchool} />
          </FormControl>
          <FormHelperText style={{ fontSize: 9, color: 'black', width: 300 }}>
            * If your school is not in the list, choose &apos;other schools&apos;
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <MajorAutocomplete major={major} setMajor={setMajor} />
          <FormHelperText style={{ fontSize: 9, color: 'black', width: 300 }}>
            * If your major is not in the list, choose &apos;other majors&apos;
          </FormHelperText>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            variant="standard"
            label="Level of Study"
            style={{ minWidth: 300, marginTop: -5.5, maxWidth: 300 }}
            onChange={(e) => {
              setGrad(e.target.value);
            }}
            select
            InputLabelProps={{
              style: { color: '#000000' },
              classes: { root: classes.label }
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
        </Grid>

        <Grid container item xs={12} direction="row" alignItems="center" justify="center">
          <Grid item xs={11} md={7}>
            <TextField
              required
              variant="standard"
              label="Grad Month"
              style={{
                minWidth: 145,
                marginTop: 10,
                maxWidth: 145,
                marginBottom: -3
              }}
              onChange={(e) => {
                setGrad_month(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#000000' },
                classes: { root: classes.label }
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
                marginBottom: -3
              }}
              onChange={(e) => {
                setGrad_year(e.target.value);
              }}
              select
              InputLabelProps={{
                style: { color: '#000000' },
                classes: { root: classes.label }
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
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {resume}
        {codeOfConduct}
        {eventLogistics}
        {communication}
      </Grid>

      <Grid item container xs={12} direction="column" alignItems="center" justify="center">
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

  const confirmation = (
    <div style={{ textAlign: 'center' }}>
      <h1>Thank you!</h1>
      <h3>A confirmation has been sent to your email.</h3>
      <Typography>
        Please check your inbox (and spam) and click the link to confirm your email address.
      </Typography>
      <Typography>
        Your application to HopHacks will be complete after email confirmation!
      </Typography>
    </div>
  );

  function selectPage() {
    if (activePage === ACCOUNT) {
      // account page
    } else if (activePage === PROFILE) {
      return (
        <>
          <div className="personal-wrapper">{personalInfo}</div>
        </>
      );
    } else {
      // confirmation page
      return (
        <>
          <div className="confirm-wrapper">{confirmation}</div>
        </>
      );
    }
  }

  return (
    <body
      style={{
        backgroundImage: `url("https://hophacks-website.s3.amazonaws.com/images/2022_theme.png")`,
        backgroundSize: 'cover',
        height: '100vh'
      }}
    >
      <div className="container">
        {/* <div className="register-wrapper">{selectPage()}</div> */}
        {selectPage()}
      </div>
    </body>
  );
}
