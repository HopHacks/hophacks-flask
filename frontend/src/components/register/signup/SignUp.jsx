import React, { useState } from 'react';
import axios from 'axios';
import { isValidPhoneNumber } from 'react-phone-number-input';
import '../../../stylesheets/register.css';
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
    if (username.length === 0) {
      setConfirmMsg('* Email cannot be empty');
      return;
    }
    if (password.length === 0) {
      setConfirmMsg('* Password cannot be empty');
      return;
    }
    if (passwordConfirm.length === 0) {
      setConfirmMsg('* Confirmed Password cannot be empty');
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

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setConfirmMsg(
        'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.'
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

  async function handleProfileNext() {
    if (first_name.length === 0) {
      setProfileSubmitMsg('* First name cannot be empty.');
      return;
    }
    if (last_name.length === 0) {
      setProfileSubmitMsg('* Last name cannot be empty.');
      return;
    }
    if (age.length === 0 || age === 0) {
      setProfileSubmitMsg('* Age cannot be empty.');
      return;
    }
    const agere = /^[0-9\b]+$/;
    if (!agere.test(age)) {
      setProfileSubmitMsg('* Age must be an integer value.');
      return;
    }
    if (gender.length === 0) {
      setProfileSubmitMsg('* Gender cannot be empty.');
      return;
    }
    if (ethnicity.length === 0) {
      setProfileSubmitMsg('* Ethnicity cannot be empty.');
      return;
    }
    if (phone_number === undefined || phone_number.length === 0) {
      setProfileSubmitMsg('* Phone number cannot be empty.');
      return;
    }
    if (!isValidPhoneNumber(phone_number)) {
      setProfileSubmitMsg('* Please enter a valid phone number.');
      return;
    }
    if (school.length === 0) {
      setProfileSubmitMsg('* School cannot be empty.');
      return;
    }
    if (major.length === 0) {
      setProfileSubmitMsg('* Major cannot be empty.');
      return;
    }
    if (grad.length === 0) {
      setProfileSubmitMsg('* Program cannot be empty.');
      return;
    }
    if (grad_month.length === 0) {
      setProfileSubmitMsg('* Grad month cannot be empty.');
      return;
    }
    if (grad_year.length === 0) {
      setProfileSubmitMsg('* Grad year cannot be empty.');
      return;
    }
    if (resumeFile === '') {
      setProfileSubmitMsg('* Please upload your resume.');
      return;
    }
    if (!resumeChecked) {
      setProfileSubmitMsg('* Please read the HopHacks Resume Authorization.');
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
      //   await axios.post('/api/slack/registration', {
      //     first_name: first_name,
      //     last_name: last_name,
      //     school: school,
      //   });
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

  function selectPage() {
    if (activePage === ACCOUNT) {
      console.log('account page');
      return (
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
      console.log('profile page');
      return (
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
          resumeFile={resumeFile}
          resumeChecked={resumeChecked}
          conductCodeChecked={conductCodeChecked}
          eventLogisticsChecked={eventLogisticsChecked}
          communicationChecked={communicationChecked}
          profileSubmitMsg={profileSubmitMsg}
          enabledButton={enabledButton}
          handleProfileNext={handleProfileNext}
          handleResumeFileChange={handleResumeFileChange}
          handleResumeCheckBox={handleResumeCheckBox}
          handleConductCheckBox={handleConductCheckBox}
          handleLogisticsCheckBox={handleLogisticsCheckBox}
          handleCommunicationCheckBox={handleCommunicationCheckBox}
        />
      );
    } else {
      console.log('confirmation page');
      return <SignUpConfirmation isMobile={isMobile} />;
    }
  }

  return <div>{selectPage()}</div>;
}
