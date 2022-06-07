import React, { useState, useEffect } from "react";
import axios from "axios";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { withAuthCheck } from "../../util/auth.jsx";
import { Link } from "react-router-dom";
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormDialog from "./FormDialog"
import MajorAutocomplete from "./MajorAutocomplete"
import SchoolAutocomplete from "./SchoolAutocomplete"
import eventName from '../../event.txt'

const Profile = function Profile(props) {

  const [status, setStatus] = useState("Application not complete: confirm email");
  const [resumeFile, setResumeFile] = useState("");
  const [vaccinationFile, setVaccinationFile] = useState("");
  const [oldResumeName, setOldResumeName] = useState("");
  const [oldVaccinationName, setOldVaccinationName] = useState("");
  //display database
  const [profile, setProfile] = useState([]);
  //edit 
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
  const [confirmed, setConfirmed] = useState(false);
  const [sendConfimationMsg, setSendConfimationMsg] = useState("");
  const [resumeMsg, setResumeMsg] = useState("Acceptable format: *.pdf, *.doc, *.docx");
  const [vaccinationMsg, setVaccinationMsg] = useState("Acceptable format: *.pdf, *.png, *.jpeg, *.jpg");


  const currentEvent = "Fall 2021"
  const rsvpStatus = "RSVPed! You're all set; you can also cancel your RSVP anytime.";
  const acceptedStatus = "You have been accepted to HopHacks. Please RSVP if you plan on participating!"
  const appCompleteStatus = "Application complete!"
  

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },

    root: {
      marginLeft: "25%",
      width: "50%",
      minWidth:"450px",
    },

    title: {
      fontSize: 80,
    },

  }));
  const classes = useStyles();

  async function getResumeFileName() {
    /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
    if (!props.isLoggedIn) return;

    try {
      const response = await axios.get("/api/resumes/filename");
      setOldResumeName(response.data["filename"])
    } catch (e) {
      setOldResumeName("");
    }
  }

  async function getVaccinationFileName() {
    /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
    if (!props.isLoggedIn) return;

    try {
      const response = await axios.get("/api/vaccination/filename");
      setOldVaccinationName(response.data["filename"])
    } catch (e) {
      setOldVaccinationName("");
    }
  }

  function handleResumeFileChange(e) {
    setResumeFile(e.target.files[0])
  }

  function handleVaccinationFileChange(e) {
    setVaccinationFile(e.target.files[0])
  }

  async function handleResumeSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("file", resumeFile);

    try {
      const response = await axios.post("/api/resumes/", data);
      setResumeMsg("Resume has been successfully uploaded")
    } 
    catch (e) {
      setResumeMsg("Failed to upload resume. Please try again.")
    }

    // TODO handle error!
  }

  async function handleVaccinationSubmit(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("file", vaccinationFile);

    try {
      const response = await axios.post("/api/vaccination/", data);
      setVaccinationMsg("Vaccination card has been successfully uploaded")
    } 
    catch (e) {
      setVaccinationMsg("Failed to upload vaccination card. Please try again.")
    }

    // TODO handle error!
  }

  async function handleResumeDownload(e) {
    e.preventDefault();

    const response = await axios.get("/api/resumes/");
    const url = response.data['url'];
    window.open(url, "_blank");
  }

  async function handleVaccinationDownload(e) {
    e.preventDefault();

    const response = await axios.get("/api/vaccination/");
    const url = response.data['url'];
    window.open(url, "_blank");
  }

  async function getProfile() {
    if (!props.isLoggedIn) return;
    const response = await axios.get('/api/accounts/profile/get');

    setProfile(response.data.profile);
    setFirst_name(response.data.profile.first_name)
    setLast_name(response.data.profile.last_name)
    setGender(response.data.profile.gender)
    setMajor(response.data.profile.major)
    setPhone_number(response.data.profile.phone_number)
    setSchool(response.data.profile.school)
    setEthnicity(response.data.profile.ethnicity)
    setGrad(response.data.profile.grad)
    setGrad_month(response.data.profile.grad_month)
    setGrad_year(response.data.profile.grad_year)
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
    try {
      await axios.post('/api/accounts/profile/update', {
        "profile": profile
      })
      getProfile();
    }
    catch (e) {
      console.log("fail to update")
    }
  }

  async function applyToCurrentEvent() {
    if (!props.isLoggedIn) return;
    if (status === "Application not complete: confirm email") {
      const res = await axios.post('/api/registrations/apply', {
        "event": currentEvent, "details": "none"
      })
      getStatus();
    }
  }

  async function getEmailConfirmStatus() {
    if (!props.isLoggedIn) return;
    const response = await axios.get('/api/registrations/get')
    response.data.registrations.forEach(registration => {
      if (registration.event === currentEvent) {
        
        if(registration.rsvp){
          setStatus(rsvpStatus)
        }
        else if (registration.accept) {
          setStatus(acceptedStatus)
        }
        
        else {
          setStatus(appCompleteStatus)
        }
      }
    });
  }

  async function sendConfirmationEmail() {
    try {
      await axios.post('/api/accounts/confirm_email/request', {
        "confirm_url": window.location.protocol + '//' + window.location.host + '/confirm_email'
      })
      setSendConfimationMsg("Sent confirmation email successfully!")
    }
    catch (e) {
      setSendConfimationMsg("Unable to send confirmation email")
    }
  }

async function rsvp(event){
    try{
        await axios.post("/api/registrations/rsvp/rsvp", {"event":event});
        setStatus(rsvpStatus)
    }
    catch(e){
        // maybe TODO: more descriptive error messages depending on error code?
        alert("Failed");
    }

   
}

async function cancel(event){

  try{
      await axios.post("/api/registrations/rsvp/cancel", {"event":event});
      setStatus(acceptedStatus)
  }
  catch(e){
      alert("Failed");
  }

  

}

  useEffect(() => {
    getStatus();
    getProfile();
    getResumeFileName();
    getVaccinationFileName();
    getEmailConfirmStatus();
  }, [props.isLoggedIn]);

  function ActionItems() {
    if (!confirmed) {
      return (
        <>
          <button onClick={sendConfirmationEmail}>Request Email Confirmation</button>
          <p>{sendConfimationMsg}</p>
        </>
      )
    } else if (confirmed && status === appCompleteStatus) {
      return (
        <p>You have successfully applied to HopHacks. Please be patient while we process your application :)</p>
      )
    } else if (status === acceptedStatus) {
      return (
        <>
        <button onClick={() => rsvp(currentEvent)}>RSVP</button>
        </>
      )
    } else if (status == rsvpStatus){
      
      return(
      <>
      <button onClick={() => cancel(currentEvent)}>Cancel RSVP</button>
      </>
      )
    }


  }

  const appStatus = (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
          Application
              </Typography>
        <Typography color="textSecondary" style={{ fontSize: '15px' }} >
          You need to confirm your email before applying to the current event. Once you are accepted to the event, you can RSVP to the event.
              </Typography>
        <Table>
          <TableHead>
            <TableCell>
              Current Event
                    </TableCell>
            <TableCell>
              Application Status
                    </TableCell>
            <TableCell>
              Action Items
                    </TableCell>
          </TableHead>
          <TableRow>
            <TableCell>
              {currentEvent}
            </TableCell>
            <TableCell>
              {status}
            </TableCell>
            <TableCell>
              <div>
                {ActionItems()}
              </div>
            </TableCell>
          </TableRow>
        </Table>
      </CardContent>
    </Card>
  )

  const resume = (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
          Resume
              </Typography>
        <Typography color="textSecondary" style={{ fontSize: '15px' }} >
          You can replace your resume by clicking on “Choose File” above and selecting a new file. You can have only one resume attached to your profile.
                </Typography>
        <Table>
          <TableHead>
            <TableCell>
              File Name
                    </TableCell>
            <TableCell>
              Action
                    </TableCell>
            <TableCell>
              Upload Resume
                    </TableCell>
          </TableHead>
          <TableRow>
            <TableCell>
              {oldResumeName}
            </TableCell>
            <TableCell>
              <Link onClick={handleResumeDownload} style={{ fontSize: '15px', color: 'blue' }}>
                Download
              </Link>
            </TableCell>
            <TableCell>
              <form onSubmit={handleResumeSubmit}>
                <div>
                  <input type="file" name="file" onChange={handleResumeFileChange} />
                </div>
                <input type="submit" value="Submit" />
                <Typography style={{ fontSize: '13px'}}> {resumeMsg} </Typography>
              </form>
            </TableCell>
          </TableRow>
        </Table>
      </CardContent>

    </Card>
  );

  const vaccination = (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
          Vaccination
        </Typography>
        <Typography color="textSecondary" style={{ fontSize: '15px' }} >
          In response to the current administrative policy, this year's participants are required to be fully vaccinated or follow the indoor mask policy. Please upload a picture of your vaccination card if you are fully vaccinated. 
        </Typography>
        <Table>
          <TableHead>
            <TableCell>
              File Name
                    </TableCell>
            <TableCell>
              Action
                    </TableCell>
            <TableCell>
              Upload Vaccination Card
                    </TableCell>
          </TableHead>
          <TableRow>
            <TableCell>
              {oldVaccinationName}
            </TableCell>
            <TableCell>
              <Link onClick={handleVaccinationDownload} style={{ fontSize: '15px', color: 'blue' }}>
                Download
              </Link>
            </TableCell>
            <TableCell>
              <form onSubmit={handleVaccinationSubmit}>
                <div>
                  <input type="file" name="file" onChange={handleVaccinationFileChange} />
                </div>
                <input type="submit" value="Submit" />
                <Typography style={{ fontSize: '13px'}}> {vaccinationMsg} </Typography>
              </form>
            </TableCell>
          </TableRow>
        </Table>
      </CardContent>
    </Card>
  );

  const NameForm = (
    <div>
      <form>
        <TextField id="standard-basic" variant="outlined" label="First Name" defaultValue={profile.first_name} onChange={e => setFirst_name(e.target.value)} />
      </form>
      <form>
        <TextField id="standard-basic" variant="outlined" label="Last Name" defaultValue={profile.last_name} onChange={e => setLast_name(e.target.value)} />
      </form>
    </div>
  )

  const GenderForm = (
    <form>
      <FormControl className={classes.formControl}>
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
  )

  const EthnicityForm = (
    <form>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Ethnicity</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={ethnicity}
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
    </form>
  )

  const SchoolForm = (
    <form>
      <SchoolAutocomplete
        school={school}
        setSchool={setSchool} />
    </form>
  )

  const MajorForm = (
    <form>
      <MajorAutocomplete
        major={major}
        setMajor={setMajor} />
    </form>
  )

  const ProgramForm = (
    <form>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Program</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={grad}
          onChange={(e) => {
            setGrad(e.target.value);
          }}
        >
          <MenuItem value="Undergraduate">Undergraduate</MenuItem>
          <MenuItem value="Graduate">Graduate</MenuItem>
          <MenuItem value="Postgraduate">Postgraduate</MenuItem>
        </Select>
      </FormControl>
    </form>
  )

  const PhoneNumberForm = (
    <form>
      <TextField id="standard-basic" variant="outlined" label="Phone Number" defaultValue={profile.phone_number} onChange={e => setPhone_number(e.target.value)} />
    </form>
  )

  const GraduationForm = (
    <div>
      <form>
        <FormControl className={classes.formControl}>
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
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={grad_year}
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
      </form>
    </div>
  )

  const ProfileCard =
    (
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title} gutterBottom style={{ fontSize: '30px' }}>
            Profile
              </Typography>

          <List className='list'>

            <FormDialog
              title={"Edit Name"}
              form={NameForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Name"}
              secondaryText={profile.first_name + " " + profile.last_name} />

            <FormDialog
              title={"Edit Gender"}
              form={GenderForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Gender"}
              secondaryText={profile.gender} />

            <FormDialog
              title={"Edit Ethnicity"}
              form={EthnicityForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Ethnicity"}
              secondaryText={profile.ethnicity} />

            <FormDialog
              title={"Edit School"}
              form={SchoolForm}
              handleProfileSave={handleProfileSave}
              primaryText={"School"}
              secondaryText={profile.school} />

            <FormDialog
              title={"Edit Major"}
              form={MajorForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Major"}
              secondaryText={profile.major} />

            <FormDialog
              title={"Edit Program"}
              form={ProgramForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Program"}
              secondaryText={profile.grad} />

            <FormDialog
              title={"Edit Expected Graduation Date"}
              form={GraduationForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Expected Graduation Date"}
              secondaryText={profile.grad_month + " " + profile.grad_year} />

            <FormDialog
              title={"Edit Phone Number"}
              form={PhoneNumberForm}
              handleProfileSave={handleProfileSave}
              primaryText={"Phone Number"}
              secondaryText={profile.phone_number} />

          </List>
        </CardContent>

      </Card>
    );

  return (
    <div>
      <div>
        {appStatus}
      </div>
      <div>
        {resume}
      </div>
      <div>
        {vaccination}
      </div>
      <div>
        {ProfileCard}
      </div>
    </div>
  );
}

export default withAuthCheck(Profile);
