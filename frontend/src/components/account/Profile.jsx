import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { withAuthCheck } from '../../util/auth.jsx';

import ProfileReturningUser from './ProfileReturningUser.jsx';
import { isValidPhoneNumber } from 'react-phone-number-input';
import ProfileOldUser from './ProfileOldUser.jsx';
const Profile = function Profile(props) {
  const isMobile = props.isMobile;

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  const [step, setStep] = useState("update info");

  //display database
  const [profile, setProfile] = useState([]);
  //edit
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState(0);
  const [major, setMajor] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [school, setSchool] = useState('');
  const [otherSchool, setOtherSchool] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [grad, setGrad] = useState('');
  const [grad_month, setGrad_month] = useState('');
  const [grad_year, setGrad_year] = useState('');
  const [country, setCountry] = useState('');
  const [first_hackathon, setFirst_hackathon] = useState('');
  const [first_hophacks, setFirst_hophacks] = useState('');
  const [learn_about_us, setLearn_about_us] = useState('');
  const [profileSubmitMsg, setProfileSubmitMsg] = useState('');
  const [enabledButton, setEnabledButton] = useState(true); //TMP get rid of setEnabledButton
  const [linkedIn, setLinkedIn] = useState('');
  const [profileUpToDate, setProfileUpToDate] = useState(false);

  const [resumeChecked, setResumeChecked] = useState(false);
  const [conductCodeChecked, setConductCodeChecked] = useState(false);
  const [eventLogisticsChecked, setEventLogisticsChecked] = useState(false);
  const [communicationChecked, setCommunicationChecked] = useState(false);

  async function getProfileUpToDate() {
    /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
    if (!props.isLoggedIn) return;

    try {
      const response = await axios.get('/api/accounts/updatedAccount/get');
      setProfileUpToDate(response.data['updated']);
    } catch (e) {
      console.log('error');
    }
  }

  async function handleProfileNext() {

    if (step === "update info") {
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

      if (linkedIn.length === 0) {
        setProfileSubmitMsg('* Please enter your linkedin link.');
        return;
      }

      setStep("checks")
    } else if (step === "checks") {


      if (!resumeChecked) {
        setProfileSubmitMsg('* Please agree to the resume terms.');
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


    const newProfile = {
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
      grad_month: grad_month,
      grad_year: grad_year,
      country: country,
      first_hackathon: first_hackathon,
      first_hophacks: first_hophacks,
      learn_about_us: learn_about_us,
      linkedIn: linkedIn,
      is_jhu: school === 'Johns Hopkins University' ? true : false
    };
    if (!props.isLoggedIn) return;
    try {
      await axios.post('/api/accounts/profile/update', {
        profile: newProfile
      });
    } catch (e) {
      console.log('fail to update');
    }
    await axios.post('/api/accounts/updatedAccount/post');
    getProfileUpToDate();
  }
  }

  useEffect(() => {
    getProfileUpToDate();
    getProfile();
  }, [props.isLoggedIn]);

  async function getProfile() {
    if (!props.isLoggedIn) return;
    const response = await axios.get('/api/accounts/profile/get');

    setProfile(response.data.profile);
    setFirst_name(response.data.profile.first_name);
    setLast_name(response.data.profile.last_name);
    setGender(response.data.profile.gender);
    setMajor(response.data.profile.major);
    setPhone_number(response.data.profile.phone_number);
    setSchool(response.data.profile.school);
    setEthnicity(response.data.profile.ethnicity);
    setGrad(response.data.profile.grad);
    setGrad_month(response.data.profile.grad_month);
    setGrad_year(response.data.profile.grad_year);
    setAge(response.data.profile.age);
    setFirst_hackathon(response.data.profile.first_hackathon);
    setFirst_hophacks(response.data.profile.first_hophacks);
    setLearn_about_us(response.data.profile.learn_about_us);
    setCountry(response.data.profile.country);
    setLinkedIn(response.data.profile.linkedIn || '');
  }

  if (!profileUpToDate) {
    return (
      <ProfileOldUser
        props={props}
        isMobile={isMobile}
        step={step}
        setFirst_name={setFirst_name}
        setLast_name={setLast_name}
        setAge={setAge}
        setGender={setGender}
        setEthnicity={setEthnicity}
        setMajor={setMajor}
        setPhone_number={setPhone_number}
        setSchool={setSchool}
        setGrad={setGrad}
        setGrad_month={setGrad_month}
        setGrad_year={setGrad_year}
        setCountry={setCountry}
        setFirst_hackathon={setFirst_hackathon}
        setFirst_hophacks={setFirst_hophacks}
        setLearn_about_us={setLearn_about_us}
        setOtherSchool={setOtherSchool}
        setLinkedIn={setLinkedIn}
        first_name={first_name}
        last_name={last_name}
        gender={gender}
        age={age}
        major={major}
        phone_number={phone_number}
        school={school}
        ethnicity={ethnicity}
        grad={grad}
        grad_month={grad_month}
        grad_year={grad_year}
        country={country}
        linkedIn={linkedIn}
        first_hackathon={first_hackathon}
        first_hophacks={first_hophacks}
        learn_about_us={learn_about_us}
        profileSubmitMsg={profileSubmitMsg}
        enabledButton={enabledButton}
        profile={profile}
        otherSchool={otherSchool}
        handleProfileNext={handleProfileNext}
        setEnabledButton={setEnabledButton}
        resumeChecked={resumeChecked}
        setResumeChecked={setResumeChecked}
        conductCodeChecked={conductCodeChecked}
        setConductCodeChecked={setConductCodeChecked}
        eventLogisticsChecked={eventLogisticsChecked}
        setEventLogisticsChecked={setEventLogisticsChecked}
        communicationChecked={communicationChecked}
        setCommunicationChecked={setCommunicationChecked}
      />
    );
  } else {
    return <ProfileReturningUser isMobile={isMobile} />;
  }
};

export default withAuthCheck(Profile);
