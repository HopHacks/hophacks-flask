import React, {useState, useEffect} from "react";
import axios from "axios";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {withAuthCheck} from "../util/auth.jsx";
import { Link } from "react-router-dom";


const Profile = function Profile(props) {
    const [status, setStatus] = useState("not applied");
    const [file, setFile] = useState("");
    const [oldName, setOldName] = useState("");
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
    const [msg, setMsg] = useState("");
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [confirmed, setConfirmed] = useState(false);
    const [sendConfimationMsg, setSendConfimationMsg] = useState("");



    const currentEvent = "spring_2021"
    const useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
      }));
    const classes = useStyles();


    async function getFileName() {
        /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
        if (!props.isLoggedIn) return;

        try {
            const response = await axios.get("/api/resumes/filename");
            setOldName(response.data["filename"])
        } catch(e) {
            setOldName("");
        }
    }

    function handleFileChange(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);

        const response = await axios.post("/api/resumes/", data);
        // TODO handle error!
    }

    async function handleDownload(e) {
        e.preventDefault();

        const response = await axios.get("/api/resumes/");
        const url = response.data['url'];
        window.open(url, "_blank");
    }

    async function getProfile(){
        if(!props.isLoggedIn) return;
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

    async function getStatus(){
        if(!props.isLoggedIn) return;
        const response = await axios.get('/api/accounts/profile/email_confirmed');

        if (response.data.email_confirmed){
            setConfirmed(true);
        } else {
            setConfirmed(false);
        }
    }

    async function handleProfileSave(){
        if(!props.isLoggedIn) return;
        try{
            await axios.post('/api/accounts/profile/update', {
                "profile": profile})
        }
        catch(e){
            console.log("fail to update")
        }
    }

    async function applyToCurrentEvent(){
        if(!props.isLoggedIn) return;
        if(status === "not applied"){
            const res = await axios.post('/api/registrations/apply', {
                "event": currentEvent, "details": "none"})
            setMsg(res.data.msg);
            getStatus();
        }
    }

    async function getEmailConfirmStatus(){
        if(!props.isLoggedIn) return;
        const response = await axios.get('/api/registrations/get')
        response.data.registrations.forEach(registration =>{
            if(registration.event === currentEvent){
                if(registration.accept){
                    setStatus("accepted")
                }
                else{
                    setStatus("applied")
                }
            }
        });
    }

    async function sendConfirmationEmail(){
        try {
            const response = await axios.post('/api/accounts/confirm_email/request', {
                "confirm_url": window.location.protocol + '//' + window.location.host + '/confirm_email'
            })
            setSendConfimationMsg("Send confirmation email successfully!")
        }
        catch(e) {
            setSendConfimationMsg("Unable to send confirmation email")
        }
    }


    useEffect(() => {
        getStatus();
        getProfile();
        getFileName();
        getEmailConfirmStatus();
    }, [props.isLoggedIn]);

    const loading = open && options.length === 0;
  
    useEffect(() => {
        let active = true;
    
        if (!loading) {
          return undefined;
        }
    
        (async () => {
          const response = await axios.get('http://universities.hipolabs.com/search');
          const colleges = await response.data;
          if (active) {
            setOptions(Object.keys(colleges).map((key) => colleges[key]));
          }
        })();
    
        return () => {
          active = false;
        };
      }, [loading]);
    
      
    useEffect(() => {
        if (!open) {
          setOptions([]);
        }
    }, [open]);

    function firstNameForm() {
        return (<div>

            <p>First Name:{profile.first_name}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                    <label>
                        <input type="text" value = {first_name} name = "first_name" onChange={e => setFirst_name(e.target.value)}/>
                    </label>
                <input type="submit"  value="SAVE" onClick={()=>{profile.first_name = first_name}}/>
                </form>
            </div>
            </div>
            );
    }

    function lastNameForm(){
        return (
            <div>
            <p>Last Name:{profile.last_name}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                    <label>
                    <input type="text" value = {last_name} name = "last_name" onChange={e => setLast_name(e.target.value)}/>
                    </label>
                <input type="submit"  value="SAVE" onClick={()=>{profile.last_name = last_name}}/>
                </form>
            </div>
            </div>
            );
    }

    function genderForm(){
        return (
        <div>
        <p>Gender:{profile.gender}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={gender}
                onChange={(e)=>{
                    setGender(e.target.value);
                }}
                >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                <MenuItem value="Prefer not to disclose">Prefer not to disclose</MenuItem>
                </Select>
            </FormControl>
                <input type="submit"  value="SAVE" onClick={()=>{profile.gender = gender}}/>
                </form>
            </div>
            </div>
            );
    }

    function majorForm(){
        return (
        <div>
        <p>Major:{profile.major}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                    <label>
                    <input type="text" value = {major} name = "major" onChange={e => setMajor(e.target.value)}/>
                    </label>
                <input type="submit"  value="SAVE" onClick={()=>{profile.major = major}}/>
                </form>
            </div>
            </div>
        );
    }

    function phoneNumberForm(){
        return (      
            <div>     
        <p>Phone Number:{profile.phone_number}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                    <label>
                        <input type="text" value = {phone_number} name = "phone_number" onChange={e => setPhone_number(e.target.value)}/>
                    </label>
                <input type="submit"  value="SAVE" onClick={()=>{profile.phone_number = phone_number}}/>
                </form>
            </div>
            </div>
            );
    }

    function schoolForm(){
        return (   
            <div>       
              <p>School:{profile.school}</p>
              <div>
                <form onSubmit = {handleProfileSave}>
                <Autocomplete
      id="schools"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      options={options}
      loading={loading}
      onChange={(event, newValue) => {
        setSchool(newValue.name);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="School"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
                <input type="submit"  value="SAVE" onClick={()=>{
                    profile.school = school
                    if (school === "Johns Hopkins University"){
                        profile.is_jhu = true;
                    }
                    else{
                        profile.is_jhu = false;
                    }
                    }}/>
                </form>
                </div>
</div>
);
    }

    function ethnicityForm(){
        return (
            <div>
            <p>Ethnicity:{profile.ethnicity}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Ethnicity</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={ethnicity}
                onChange={(e)=>{
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
                <input type="submit"  value="SAVE" onClick={()=>{profile.ethnicity = ethnicity}}/>
                </form>
            </div>
            </div>
);
    }

    function gradForm(){
        return (    
            <div>        
        <p>Grad:{profile.grad}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Grad</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={grad}
                onChange={(e)=>{
                    setGrad(e.target.value);
                }}
                >
                <MenuItem value="Undergraduate">undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                </Select>
            </FormControl>
                <input type="submit"  value="SAVE" onClick={()=>{profile.grad = grad}}/>
                </form>
            </div>
            </div>
);
    }

    function graduationDateForm(){
        return (    
            <div>        
            <p>Graduation Date: {profile.grad_month} {profile.grad_year}</p>
            <div>
                <form onSubmit = {handleProfileSave}>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Grad Month</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={grad_month}
                onChange={(e)=>{
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
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Grad Year</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={grad_year}
                onChange={(e)=>{
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
            
                <input type="submit"  value="SAVE" onClick={()=>{
                    profile.grad_year = grad_year;
                    profile.grad_month = grad_month;
                }}/>
                </form>
            </div>
        </div>);
    }

    function uploadDocument(){
        return (
        <div>
            <div>
            Status for {currentEvent} Event: {status}
            </div>
        <form onSubmit={handleSubmit}>
            <div>
            <input type="file" name="file" onChange={handleFileChange}/>
            </div>
            <input type="submit" value="Submit" />
        </form>

        <hr/>
        <p>{oldName}</p>
        <button onClick={handleDownload}>Download</button>
      </div>
        );
    }

    function applyEvent(){
        return(
            <div>
                {!confirmed && 
            <button onClick={sendConfirmationEmail}>Request Email Confirmation</button>
            }
        {!confirmed && 
        <p>{sendConfimationMsg}</p>
        }
        {confirmed && status === "not applied" &&
        <button onClick={applyToCurrentEvent}>Apply For Current Hackathon</button>
        }
        <p>{msg}</p>

          <p>
          <Link to="/rsvp">RSVP</Link>
          </p>
            </div>
        );
    }

    return (
        <div>
            <div>
                {uploadDocument()}
            </div>
            <div>
            <p>Profile</p>
                {firstNameForm()}
                {lastNameForm()}
                {genderForm()}
                {majorForm()}
                {schoolForm()}
                {phoneNumberForm()}
                {ethnicityForm()}
                {gradForm()}
                {graduationDateForm()}
            </div>
            <div>
                {applyEvent()}
            </div>
        </div>
    );
}

export default withAuthCheck(Profile);
