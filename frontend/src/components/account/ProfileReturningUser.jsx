import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { withAuthCheck } from '../../util/auth.jsx';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import FormDialog from './FormDialog';
import MajorAutocomplete from './MajorAutocomplete';
import SchoolAutocomplete from './SchoolAutocomplete';
import CountryAutocomplete from './CountryAutocomplete';

import '../../stylesheets/profile.css';

function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

//current users
const ProfileReturningUser = function ProfileReturningUser(props) {
  const isMobile = props.isMobile;

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  const [status, setStatus] = useState('Application not complete: confirm email');
  const [resumeFile, setResumeFile] = useState('');
  const [oldResumeName, setOldResumeName] = useState('');

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
  const [confirmed, setConfirmed] = useState(false);
  const [sendConfimationMsg, setSendConfimationMsg] = useState('');
  const [resumeMsg, setResumeMsg] = useState('Acceptable format: *.pdf, *.doc, *.docx');
  const [ageMsg, setAgeMsg] = useState('');

  const currentEvent = 'Fall 2025';
  const rsvpStatus = "RSVPed! You're all set; you can also cancel your RSVP anytime.";
  const acceptedStatus =
    'You have been accepted to HopHacks. Please RSVP if you plan on participating!';
  const appCompleteStatus = 'Application complete!';

  async function getResumeFileName() {
    /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
    if (!props.isLoggedIn) return;

    try {
      const response = await axios.get('/api/resumes/filename');
      setOldResumeName(response.data['filename']);
    } catch (e) {
      setOldResumeName('');
    }
  }

  function handleResumeFileChange(e) {
    setResumeFile(e.target.files[0]);
  }

  async function handleResumeSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append('file', resumeFile);

    try {
      await axios.post('/api/resumes/', data);
      setResumeMsg('Resume has been successfully uploaded');
    } catch (e) {
      setResumeMsg('Failed to upload resume. Please try again.');
    }

    // TODO handle error!
  }

  async function handleResumeDownload(e) {
    e.preventDefault();

    const response = await axios.get('/api/resumes/');
    const url = response.data['url'];
    window.open(url, '_blank');
  }

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
    setOtherSchool(response.data.profile.otherSchool);
    setEthnicity(response.data.profile.ethnicity);
    setGrad(response.data.profile.grad);
    setGrad_month(response.data.profile.grad_month);
    setGrad_year(response.data.profile.grad_year);
    setAge(response.data.profile.age);
    setFirst_hackathon(response.data.profile.first_hackathon);
    setFirst_hophacks(response.data.profile.first_hophacks);
    setLearn_about_us(response.data.profile.learn_about_us);
    setCountry(response.data.profile.country);
  }

  async function getStatus() {
    if (!props.isLoggedIn) return;
    const response = await axios.get('/api/accounts/profile/email_confirmed');

    if (response.data.email_confirmed) {
      setConfirmed(true);
    } else {
      setConfirmed(false);
    }
  }

  function openPhotoRelease(event) {
    event.preventDefault();
    window.open(img('JHU_Photo-and-Video-Release_20192.pdf'), '_blank');
  }

  async function handleProfileSave() {
    if (!props.isLoggedIn) return;
    profile.first_name = first_name;
    profile.last_name = last_name;
    profile.gender = gender;
    profile.major = major;
    profile.phone_number = phone_number;
    profile.school = school;
    profile.ethnicity = ethnicity;
    profile.grad = grad;
    profile.grad_month = grad_month;
    profile.grad_year = grad_year;
    profile.age = age;
    profile.first_hackathon = first_hackathon;
    profile.first_hophacks = first_hophacks;
    profile.learn_about_us = learn_about_us;
    profile.country = country;
    profile.otherSchool = otherSchool;
    try {
      await axios.post('/api/accounts/profile/update', {
        profile: profile
      });
      getProfile();
    } catch (e) {
      console.log('fail to update');
    }
  }

  const checkAgeValid = () => {
    const agere = /^[0-9\b]+$/;
    if (!agere.test(age)) {
      setAgeMsg('* Age must be an integer value. Please try again.');
      return;
    }
    setAgeMsg('');
    handleProfileSave();
  };

  async function getEmailConfirmStatus() {
    if (!props.isLoggedIn) return;
    const response = await axios.get('/api/registrations/get');
    response.data.registrations.forEach((registration) => {
      if (registration.event === currentEvent) {
        if (registration.status === 'email_confirmed') {
          setStatus(
            'Upload Resume to finish applying. Reload the page to see updated application status.'
          );
        } else if (registration.rsvp) {
          setStatus(rsvpStatus);
        } else if (registration.accept) {
          setStatus(acceptedStatus);
        } else {
          setStatus(appCompleteStatus);
        }
      }
    });
  }

  async function sendConfirmationEmail() {
    try {
      await axios.post('/api/accounts/confirm_email/request', {
        confirm_url: window.location.protocol + '//' + window.location.host + '/confirm_email'
      });
      setSendConfimationMsg('Sent confirmation email successfully!');
    } catch (e) {
      setSendConfimationMsg('Unable to send confirmation email');
    }
  }

  async function rsvp(event) {
    try {
      await axios.post('/api/registrations/rsvp/rsvp', { event: event });
      setStatus(rsvpStatus);
    } catch (e) {
      // maybe TODO: more descriptive error messages depending on error code?
      alert('Failed');
    }
  }

  async function cancel(event) {
    try {
      await axios.post('/api/registrations/rsvp/cancel', { event: event });
      setStatus(acceptedStatus);
    } catch (e) {
      alert('Failed');
    }
  }

  useEffect(() => {
    getStatus();
    getProfile();
    getResumeFileName();
    getEmailConfirmStatus();
  }, [props.isLoggedIn]);

  function ActionItems() {
    if (!confirmed) {
      return (
        <>
          <button onClick={sendConfirmationEmail}>Request Email Confirmation</button>
          <p>{sendConfimationMsg}</p>
        </>
      );
    } else if (confirmed && status === appCompleteStatus) {
      return (
        <p>
          You have successfully applied to HopHacks. Please be patient while we process your
          application :)
        </p>
      );
    } else if (status === acceptedStatus) {
      return (
        <>
          <button onClick={() => rsvp(currentEvent)}>RSVP</button>
          <br />
          <span> Note, by RSVPing to our event, you consent to our </span>
          <a href={img('JHU_Photo-and-Video-Release_20192.pdf')} onClick={openPhotoRelease}>
            {' photo release form'}
          </a>
          <span>.</span>
        </>
      );
    } else if (status === rsvpStatus) {
      return (
        <>
          <button onClick={() => cancel(currentEvent)}>Cancel RSVP</button>
        </>
      );
    }
  }

  const appStatus = (
  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
    {/* Left Side: Text Content */}
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-white mb-2">Application</h2>
      <p className="text-sm text-white/90 mb-4">
        You must confirm your email before applying to the current event. Once you are accepted to
        the event, you may RSVP.
      </p>

      <div className="space-y-2">
        <div className="flex">
          <span className="font-semibold w-40 text-white">Current Event:</span>
          <span className="text-white">{currentEvent}</span>
        </div>
        <div className="flex">
          <span className="font-semibold w-40 text-white">Status:</span>
          <span className="text-white">{status}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold w-40 text-white">Action Items:</span>
          <div>{ActionItems()}</div>
        </div>
      </div>
    </div>

    {/* Right Side: Placeholder Profile Image */}
    <div className="w-[364px] h-[254px] rounded-xl overflow-hidden bg-white/30 flex items-center justify-center shadow-inner">
      <span className="text-white text-sm">Profile Image</span>
    </div>
  </div>
);




  const resume = (
  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
    <div className=" w-full text-white">
      <h2 className="text-2xl font-bold text-white mb-2">Resume</h2>

      <Typography style={{ fontSize: '15px', color: '#ddd' }}>
        You can replace your resume by clicking on “Choose File” above and selecting a new file. You
        can have only one resume attached to your profile.
      </Typography>

      {isMobile ? (
        <div className="mt-6">
          <div className="mb-4">
            <span className="font-semibold">Current Resume:</span>{' '}
            <Button onClick={handleResumeDownload} className="text-blue-400 normal-case">
              {oldResumeName}
            </Button>
          </div>

          <form onSubmit={handleResumeSubmit}>
            <div className="mb-2">
              <span className="font-semibold">Upload New Resume:</span>
              <input
                type="file"
                name="file"
                onChange={handleResumeFileChange}
                className="block mt-2 text-sm text-gray-300"
              />
            </div>
            <input
              type="submit"
              value="Submit"
              className="mt-2 px-4 py-1 bg-white text-black rounded hover:bg-gray-100 cursor-pointer"
            />
            <Typography className="text-sm text-gray-300 mt-2">{resumeMsg}</Typography>
          </form>
        </div>
      ) : (
        <div className="mt-6">
          <table className="w-full text-white text-left table-auto border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="py-2">File Name</th>
                <th className="py-2">Action</th>
                <th className="py-2">Upload Resume</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/10">
                <td className="py-2">{oldResumeName}</td>
                <td className="py-2">
                  <Button onClick={handleResumeDownload} className="px-4 py-1 bg-white text-black rounded hover:bg-gray-100 cursor-pointer">
                    Download
                  </Button>
                </td>
                <td className="py-2">
                  <form onSubmit={handleResumeSubmit} className="space-y-2">
                    <input
                      type="file"
                      name="file"
                      onChange={handleResumeFileChange}
                      className="text-sm text-gray-300"
                    />
                    <input
                      type="submit"
                      value="Submit"
                      className="px-4 py-1 bg-white text-black rounded hover:bg-gray-100 cursor-pointer"
                    />
                    <Typography className="text-sm text-gray-300">{resumeMsg}</Typography>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);
  

  const NameForm = (
    <div>
      <form>
        <TextField
          id="standard-basic"
          variant="outlined"
          label="First Name"
          defaultValue={profile.first_name}
          onChange={(e) => setFirst_name(e.target.value)}
        />
      </form>
      <form>
        <TextField
          id="standard-basic"
          variant="outlined"
          label="Last Name"
          defaultValue={profile.last_name}
          onChange={(e) => setLast_name(e.target.value)}
        />
      </form>
    </div>
  );

  const GenderForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Gender</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={gender}
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
    </form>
  );

  const AgeForm = (
    <div>
      <form>
        <TextField
          id="stand-basic"
          variant="outlined"
          label="Age"
          defaultValue={profile.age}
          onChange={(e) => setAge(e.target.value)}
        ></TextField>
      </form>
    </div>
  );

  const EthnicityForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Ethnicity</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ethnicity}
          onChange={(e) => {
            setEthnicity(e.target.value);
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
        </Select>
      </FormControl>
    </form>
  );

  const SchoolForm = (
    <form>
      <SchoolAutocomplete school={school} setSchool={setSchool} />
      {school === 'Other Schools' && (
        // <div className="text-field">
        <TextField
          variant="standard"
          label="Other School"
          value={otherSchool}
          style={{ width: '100%' }}
          onChange={(e) => {
            setOtherSchool(e.target.value);
          }}
        />
        // </div>
      )}
    </form>
  );

  const MajorForm = (
    <form>
      <MajorAutocomplete major={major} setMajor={setMajor} />
    </form>
  );

  const CountryForm = (
    <form>
      <CountryAutocomplete country={country} setCountry={setCountry} />
    </form>
  );

  const ProgramForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Level of Study</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={grad}
          onChange={(e) => {
            setGrad(e.target.value);
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
        </Select>
      </FormControl>
    </form>
  );

  const PhoneNumberForm = (
    <form>
      <TextField
        id="standard-basic"
        variant="outlined"
        label="Phone Number"
        defaultValue={profile.phone_number}
        onChange={(e) => setPhone_number(e.target.value)}
      />
    </form>
  );

  const GraduationForm = (
    <div>
      <form>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Month</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={grad_month}
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
      </form>

      <form>
        <FormControl>
          <InputLabel id="demo-simple-select-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={grad_year}
            onChange={(e) => {
              setGrad_year(e.target.value);
            }}
          >
            <MenuItem value="2025">2025</MenuItem>
            <MenuItem value="2026">2026</MenuItem>
            <MenuItem value="2027">2027</MenuItem>
            <MenuItem value="2028">2028</MenuItem>
            <MenuItem value="2029">2029</MenuItem>
            <MenuItem value="2030">2030</MenuItem>
          </Select>
        </FormControl>
      </form>
    </div>
  );

  const first_hackathonForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Is this your first Hackathon?</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={first_hackathon}
          onChange={(e) => {
            setFirst_hackathon(e.target.value);
          }}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
    </form>
  );

  const first_hophacksForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label">
          Is this your first time attending HopHacks?
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={first_hophacks}
          onChange={(e) => {
            setFirst_hophacks(e.target.value);
          }}
        >
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
        </Select>
      </FormControl>
    </form>
  );

  const learn_about_usForm = (
    <form>
      <FormControl>
        <InputLabel id="demo-simple-select-label"> How did you hear about us?</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={learn_about_us}
          onChange={(e) => {
            setLearn_about_us(e.target.value);
          }}
        >
          <MenuItem value="Instagram">Instagram</MenuItem>
          <MenuItem value="Facebook">Facebook</MenuItem>
          <MenuItem value="Linkedin">Linkedin</MenuItem>
          <MenuItem value="Google">Google</MenuItem>
          <MenuItem value="Major League Hacking">Major League Hacking</MenuItem>
          <MenuItem value="Email Listerv">Email Listerv</MenuItem>
          <MenuItem value="Friend">Friend</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
    </form>
  );
  
  const ProfileCard = (
  <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6">
    <div className=" w-full text-white">
      <h2 className="text-2xl font-bold text-white mb-2">Profile Info</h2>

      <List className="space-y-4">
        <FormDialog
          title="Edit Name"
          form={NameForm}
          handleProfileSave={handleProfileSave}
          primaryText="Name"
          secondaryText={profile.first_name + ' ' + profile.last_name}
        />

        <FormDialog
          title="Edit Gender"
          form={GenderForm}
          handleProfileSave={handleProfileSave}
          primaryText="Gender"
          secondaryText={profile.gender}
        />

        <FormDialog
          title="Edit Age"
          form={AgeForm}
          handleProfileSave={checkAgeValid}
          primaryText="Age"
          secondaryText={profile.age}
        />

        {ageMsg && (
          <Typography className="text-sm text-gray-300 ml-1 mt-[-10px]">
            {ageMsg}
          </Typography>
        )}

        <FormDialog
          title="Edit Ethnicity"
          form={EthnicityForm}
          handleProfileSave={handleProfileSave}
          primaryText="Ethnicity"
          secondaryText={profile.ethnicity}
        />

        <FormDialog
          title="Edit School"
          form={SchoolForm}
          handleProfileSave={handleProfileSave}
          primaryText="School"
          secondaryText={
            profile.school === 'Other Schools' ? profile.otherSchool : profile.school
          }
        />

        <FormDialog
          title="Edit Major"
          form={MajorForm}
          handleProfileSave={handleProfileSave}
          primaryText="Major"
          secondaryText={profile.major}
        />

        <FormDialog
          title="Edit Program"
          form={ProgramForm}
          handleProfileSave={handleProfileSave}
          primaryText="Program"
          secondaryText={profile.grad}
        />

        <FormDialog
          title="Edit Expected Graduation Date"
          form={GraduationForm}
          handleProfileSave={handleProfileSave}
          primaryText="Expected Graduation Date"
          secondaryText={profile.grad_month + ' ' + profile.grad_year}
        />

        <FormDialog
          title="Edit Country"
          form={CountryForm}
          handleProfileSave={handleProfileSave}
          primaryText="Country"
          secondaryText={profile.country}
        />

        <FormDialog
          title="Edit Phone Number"
          form={PhoneNumberForm}
          handleProfileSave={handleProfileSave}
          primaryText="Phone Number"
          secondaryText={profile.phone_number}
        />

        <FormDialog
          title="Is this your first time attending a hackathon?"
          form={first_hackathonForm}
          handleProfileSave={handleProfileSave}
          primaryText="First Hackathon?"
          secondaryText={profile.first_hackathon}
        />

        <FormDialog
          title="Is this your first time attending HopHacks?"
          form={first_hophacksForm}
          handleProfileSave={handleProfileSave}
          primaryText="First HopHacks?"
          secondaryText={profile.first_hophacks}
        />

        <FormDialog
          title="How did you hear about us?"
          form={learn_about_usForm}
          handleProfileSave={handleProfileSave}
          primaryText="How did you hear about us?"
          secondaryText={profile.learn_about_us}
        />
      </List>
    </div>
  </div>
);


  return (
    <div className="min-h-screen h-fit bg-[url('https://hophacks-recap.s3.us-east-1.amazonaws.com/recap-bg.png')] bg-cover bg-center pt-24 pb-20">
      <div className="text-4xl font-bold text-center text-white mb-8">Profile</div>

      <div className="section mb-8">
        {appStatus}
      </div>

      <div className="section mb-8">
        {resume}
      </div>

      <div className="section mb-8">
        {ProfileCard}
      </div>
    </div>
  );

};

export default withAuthCheck(ProfileReturningUser);
