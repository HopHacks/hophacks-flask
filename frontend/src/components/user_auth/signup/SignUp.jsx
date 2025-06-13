import React, { useState } from 'react';
import axios from 'axios';
import { isValidPhoneNumber } from 'react-phone-number-input';
import '../../../stylesheets/user_auth.css';
import SignUpAccount from './SignUpAccount';
import SignUpProfile from './SignUpProfile';
import SignUpChecks from './SignUpChecks'; //added check page
import SignUpImage from './SignUpImage'; //added image page
import SignUpConfirmation from './SignUpConfirmation';
import { withAuthProps } from '../../../util/auth';
import GlowButton from '../../ui/GlowButton';
import { useHistory } from 'react-router-dom';

function SignUp(props) {
  let history = useHistory();
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
  const [otherSchool, setOtherSchool] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [age, setAge] = useState(0);
  const [grad, setGrad] = useState('');
  const [grad_month, setGrad_month] = useState('');
  const [grad_year, setGrad_year] = useState('');
  const [first_hackathon, setFirst_hackathon] = useState('');
  const [first_hophacks, setFirst_hophacks] = useState('');
  const [learn_about_us, setLearn_about_us] = useState('');
  const [country, setCountry] = useState('');
  const [linkedIn, setLinkedIn] = useState('');

  const [resumeFile, setResumeFile] = useState('');

  const [profileSubmitMsg, setProfileSubmitMsg] = useState('');
  const [resumeChecked, setResumeChecked] = useState(false);

  const [conductCodeChecked, setConductCodeChecked] = useState(false);
  const [eventLogisticsChecked, setEventLogisticsChecked] = useState(false);
  const [communicationChecked, setCommunicationChecked] = useState(false);

  // -----
  const [enabledButton, setEnabledButton] = useState(true); //TMP get rid of setEnabledButton
  // const [enabledButton, setEnabledButton] = useState(true); //ORIGINAL

  // PFP Variables
  const [stage, setStage] = useState(0);
  const [body, setBody] = useState(1);
  const [accent, setAccent] = useState(0);
  const [accessory, setAccessory] = useState(0);
  const [object, setObject] = useState(0);

  const isMobile = props.isMobile;

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  // decide which page is actively showing
  const ACCOUNT = 0;
  const PROFILE = 1;
  const CHECKS = 2; //changed this to be 2
  const IMAGE = 3; //changed this to be 3
  const CONFIRMATION = 4;
  const [activePage, setActivePage] = useState(0);

  // functions for account page
  async function handleAccountNext() {
    if (password.length === 0 || passwordConfirm.length === 0 || username.length === 0) {
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

    const passwordre = /^(?=.*[0-9])(?=.*[!@#$%^&*)(+=._-])[a-zA-Z0-9!@#$%^&*)(+=._-]{6,25}$/;

    if (!password.match(passwordre)) {
      setConfirmMsg(
        'Please enter a password between 7 to 25 characters which contain at least one numeric digit and a special character.'
      );
      return;
    }

    // console.
    if (password !== passwordConfirm) {
      setConfirmMsg('Confirm password must match with the password.');
      return;
    }

    //Go to the profile page
    setActivePage(PROFILE);
  }

  // TODO: need to figure this out
  // async function handleAccountBack() {
  //   setActivePage();
  // }

  //TODO: Configure this user flow
  // async function handleProfileBack() {
  //   setActivePage(Login);
  // }

  // functions for profile page
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

  //handles the user flow of the login
  async function handleProfileNext() {
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
      return;
    }
    if (country === undefined || country.length === 0) {
      setProfileSubmitMsg('* Please select a country.');
      return;
    }

    if (school.length === 0) {
      setProfileSubmitMsg('* Please select a school.');
      return;
    }
    if (school === 'Other Schools' && otherSchool.length === 0) {
      setProfileSubmitMsg('* Please enter a valid school.');
      return;
    }
    if (ethnicity.length === 0) {
      setProfileSubmitMsg('* Please select an ethnicity.');
      return;
    }
    //TODO: not sure why there are two phone number checks
    if (phone_number === undefined || phone_number.length === 0) {
      setProfileSubmitMsg('* Please enter a valid phone number.');
      return;
    }
    if (!isValidPhoneNumber(phone_number)) {
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
    // Go to the confirmation page
    setActivePage(CHECKS);
  }

  async function handleProfileBack() {
    setActivePage(ACCOUNT);
  }

  async function handleChecksNext() {
    if (first_hackathon.length === 0) {
      setProfileSubmitMsg('* Please select if this is your first hackathon.');
      return;
    }

    if (first_hophacks.length === 0) {
      setProfileSubmitMsg('* Please select if this is your first time at hophacks.');
      return;
    }

    if (learn_about_us.length === 0) {
      setProfileSubmitMsg('* Please select how you heard about us.');
      return;
    }

    if (linkedIn.length === 0) {
      setProfileSubmitMsg('* Please enter your LinkedIn profile url.');
      return;
    }

    if (!resumeChecked || resumeFile === '') {
      setProfileSubmitMsg('* Please upload your resume and agree to the terms.');
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
    setActivePage(IMAGE);
  }

  async function handleChecksBack() {
    setActivePage(PROFILE);
  }

  async function handleImageNext() {
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
          otherSchool: otherSchool,
          ethnicity: ethnicity,
          grad: grad,
          is_jhu: school === 'Johns Hopkins University' ? true : false,
          grad_month: grad_month,
          grad_year: grad_year,
          mlh_emails: communicationChecked,
          first_hackathon: first_hackathon,
          first_hophacks: first_hophacks,
          learn_about_us: learn_about_us,
          country: country,
          linkedIn,
          pfp: `${stage}_${body}_1_${accent}_${accessory}_${object}`
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

      /*await axios.post('/api/slack/registration', {
        first_name: first_name,
        last_name: last_name,
        school: school
      });*/

      try {
        await props.login(username, password);
        // if (username !== 'admin') {
        //   history.push('/profile');
        // } else {
        //   history.push('/admin');
        // }
        console.log('failed here');
        const resumeData = new FormData();
        resumeData.append('file', resumeFile);
        await axios.post('/api/resumes/', resumeData);
      } catch (error) {
        console.log('error A');
        setEnabledButton(true);
      }
      // await axios.post('/api/slack/registration', {
      //   first_name: first_name,
      //   last_name: last_name,
      //   school: school
      // });

      // const resumeData = new FormData();
      // resumeData.append('file', resumeFile);
      // await axios.post('/api/resumes', resumeData);
    } catch (e) {
      console.log('error B');
      console.log(e);
      return;
    }
    setActivePage(CONFIRMATION);
  }

  async function handleImageBack() {
    setActivePage(CHECKS);
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

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh">
      <div
        className="min-w-[300px] max-w-[700px] w-[70%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: 'rgba(0, 29, 76, 0.9)' }}
      >
        <h2
          className="font-bold text-white text-5xl text-center mb-3"
          style={{ fontVariant: 'small-caps' }}
        >
          {activePage === 4 ? 'Profile Created' : 'Create Your Profile'}
        </h2>
        {activePage === ACCOUNT && (
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
        )}
        {activePage === PROFILE && (
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
            setCountry={setCountry}
            setOtherSchool={setOtherSchool}
            profileSubmitMsg={profileSubmitMsg}
            enabledButton={enabledButton}
            handleProfileNext={handleProfileNext}
            handleProfileBack={handleProfileBack}
          />
        )}
        {activePage === CHECKS && (
          <SignUpChecks
            isMobile={isMobile}
            setFirst_hackathon={setFirst_hackathon}
            setFirst_hophacks={setFirst_hophacks}
            setLearn_about_us={setLearn_about_us}
            resumeFile={resumeFile}
            resumeChecked={resumeChecked}
            conductCodeChecked={conductCodeChecked}
            eventLogisticsChecked={eventLogisticsChecked}
            communicationChecked={communicationChecked}
            profileSubmitMsg={profileSubmitMsg}
            enabledButton={enabledButton}
            handleChecksNext={handleChecksNext}
            handleChecksBack={handleChecksBack}
            handleResumeFileChange={handleResumeFileChange}
            handleResumeCheckBox={handleResumeCheckBox}
            handleConductCheckBox={handleConductCheckBox}
            handleLogisticsCheckBox={handleLogisticsCheckBox}
            handleCommunicationCheckBox={handleCommunicationCheckBox}
            setLinkedIn={setLinkedIn}
          />
        )}
        {activePage === IMAGE && (
          <div>
            <SignUpImage
              stage={stage}
              setStage={setStage}
              body={body}
              setBody={setBody}
              accent={accent}
              setAccent={setAccent}
              accessory={accessory}
              setAccessory={setAccessory}
              object={object}
              setObject={setObject}
              submitMsg={profileSubmitMsg}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: isMobile ? 'center' : 'space-between',
                alignItems: 'center',
                marginTop: '2rem',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '1rem' : 0
              }}
            >
              <GlowButton onClick={handleImageBack} variant="secondary" disabled={!enabledButton}>
                Back
              </GlowButton>
              <GlowButton onClick={handleImageNext} disabled={!enabledButton}>
                Next
              </GlowButton>
            </div>
            <p>{profileSubmitMsg}</p>
          </div>
        )}
        {activePage === CONFIRMATION && <SignUpConfirmation isMobile={isMobile} />}
      </div>
    </div>
  );
}

export default withAuthProps(SignUp);
