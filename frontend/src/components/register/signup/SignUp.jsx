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
import SignUpAccount from './SignUpAccount';
import SignUpProfile from './SignUpProfile';
import SignUpConfirmation from './SignUpConfirmation';

export default function SignUp(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [confirmMsg, setConfirmMsg] = useState('');
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

    const isMobile = props.isMobile;

    // decide which page is actively showing
    const ACCOUNT = 0;
    const PROFILE = 1;
    const CONFIRMATION = 2;
    const [activePage, setActivePage] = useState(ACCOUNT);

    // functions for account page
    async function handleAccountNext() {
    if (
        password.length === 0 ||
        passwordConfirm.length === 0 ||
        username.length === 0
    ) {
        setConfirmMsg('* Required field cannot be empty');
        return;
    }

    const emailre =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailre.test(String(username).toLowerCase())) {
        setConfirmMsg('Please enter a valid email address.');
        return;
    }

    const response = await axios.get('/api/accounts/check/' + username);
    if (response.data.exist) {
        setConfirmMsg('Email is already in use.');
        return;
    }

    const passwordre =
        /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
        setConfirmMsg(
        'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.',
        );
        return;
    }

    if (password !== passwordConfirm) {
        setConfirmMsg('Confirm password must match with the password.');
        return;
    }

    // Go to the profile page
    setActivePage(PROFILE);
    }

    // functions for profile page
    function isEmpty() {
        return (
            username.length === 0 ||
            password.length === 0 ||
            first_name.length === 0 ||
            last_name.length === 0 ||
            gender.length === 0 ||
            major.length === 0 ||
            school.length === 0 ||
            ethnicity.length === 0 ||
            phone_number === undefined ||
            phone_number.length === 0 ||
            grad.length === 0 ||
            grad_month === 0 ||
            grad_year === 0
        );
    }

    async function handleProfileNext() {
        if (isEmpty()) {
          setProfileSubmitMsg('* Required field cannot be empty.');
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
          setProfileSubmitMsg(
            '* Please read the MLH Terms and Conditions and Privacy Policy.',
          );
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
            confirm_url:
              window.location.protocol +
              '//' +
              window.location.host +
              '/confirm_email',
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
              mlh_emails: communicationChecked,
            },
          }),
        );
    
        try {
          setEnabledButton(false);
          await axios.post('/api/accounts/create', data);
    
          await axios.post('/api/slack/registration', {
            first_name: first_name,
            last_name: last_name,
            school: school,
          });
        } catch (e) {
          return;
        }
    
        // Go to the confirmation page
        setActivePage(CONFIRMATION);
    }

    function handleResumeFileChange(e) {
        setResumeFile(e.target.files[0]);
    }

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
                  * I authorize HopHacks to send my resume to our event sponsors for
                  recruiting purposes.
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
            <div style={{ fontSize: 15 }}>
            <span>
                * I authorize you to share my application/registration information
                with Major League Hacking for event administration, ranking, and
                MLH administration in-line with the{' '}
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
                (Optional) I authorize MLH to send me pre- and post-event
                informational emails, which contain free credit and opportunities
                from their partners.{' '}
            </span>
            </div>
        }
        />
    </FormGroup>
    );

    function selectPage() {
        if (activePage === ACCOUNT) {
            console.log("account page");
            return(
              <SignUpAccount 
                isMobile={isMobile}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                passwordConfirm={passwordConfirm}
                setPasswordConfirm={setPasswordConfirm}
                confirmMsg={confirmMsg}
                handleAccountNext={handleAccountNext}
              />
            );
        } else if (activePage === PROFILE) {
            console.log("profile page");
            return(
                <SignUpProfile
                    isMobile={isMobile}
                    setFirst_name={setFirst_name}
                    setLast_name={setLast_name}
                    setAge={setAge}
                    setGender={setGender}
                    setEthnicity={setEthnicity}
                    phone_number={phone_number}
                    setPhone_number={setPhone_number}
                    school={school}
                    setSchool={setSchool}
                    major={major}
                    setMajor={setMajor}
                    setGrad={setGrad}
                    setGrad_month={setGrad_month}
                    setGrad_year={setGrad_year}
                    resume={resume}
                    codeOfConduct={codeOfConduct}
                    eventLogistics={eventLogistics}
                    communication={communication}
                    profileSubmitMsg={profileSubmitMsg}
                    enabledButton={enabledButton}
                    setEnabledButton={setEnabledButton}
                    handleProfileNext={handleProfileNext}
                />
            );
        } else {
            console.log("confirmation page");
            return(
                <SignUpConfirmation
                    isMobile={isMobile}
                />
            );
        }
    }

    return (
        <div>
            {selectPage()}
        </div>
    );
}