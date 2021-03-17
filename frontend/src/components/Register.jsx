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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { Link } from "react-router-dom";




// Example input:

// .. sourcecode:: json

//     {
//         "username": "awong@jhu.edu",
//         "password": "gohop",
//         "confirm_url": "http://hophacks.com/confirm_email",
//         "profile": {
//             "first_name": "Andrew",
//             "last_name": "Wong",
//             "gender": "male",
//             "major": "Computer Science",
//             "phone_number": "8888888888",
//             "school": "Cornell University",
//             "ethnicity": "Asian/Pacific Islander",
//             "grad": "ugrad",
//             "is_jhu": false,
//             "grad_month": "05",
//             "grad_year": "2022"
//         }
//     }

export default function Register() {

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
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  async function handleAccountNext(){
    if(password.length==0||passwordConfirm==0||account>0){
      
      setConfirmMsg("* Required Field cannot be empty")

    }
    else{
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(username).toLowerCase())){
        const response = await axios.get('/api/accounts/check/'+username)
        if (!response.data.exist){
          if(password===passwordConfirm){
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          }
          else{
            setConfirmMsg("Confirm password must match with the password")
          }
        }
        else{
          setConfirmMsg("Email is already used")
        }
      }
      else{
        setConfirmMsg("Please enter a valid email address")
      }


    }
  };

  async function handleProfileNext() {
            try{
            const response = await axios.post('/api/accounts/create', {
                "username" : username,
                "password" : password,
                "confirm_url": "http://hophacks.com/confirm_email",
                "profile": {
                    "first_name": first_name,
                    "last_name": last_name,
                    "gender": gender,
                    "major": major,
                    "phone_number": phone_number,
                    "school": school,
                    "ethnicity": ethnicity,
                    "grad": grad,
                    "is_jhu": school==="Johns Hopkins University"?true: false,
                    "grad_month": grad_month,
                    "grad_year": grad_year,
                }})
            setMsg("Sign up successfully")
        }
        catch(e){
            setMsg("Fail to sign up")
        }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [confirmMsg, setConfirmMsg] = useState("")
    const [confirm_url, setConfirm_url] = useState("http://hophacks.com/confirm_email")
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
    const loading = open && options.length === 0;
  
    useEffect(() => {
        if (!open) {
          setOptions([]);
        }
    }, [open]);
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

    const majors = [
        "Africana Studies",
        "Anthropology",
        "Applied Mathematics & Statistics",
        "Archaeology",
        "Behavioral Biology",
        "Biology",
        "Biomedical Engineering",
        "Biophysics",
        "Chemical & Biomolecular Engineering",
        "Chemistry",
        "Civil Engineering",
        "Classics",
        "Cognitive Science",
        "Computer Engineering",
        "Computer Science",
        "Earth & Planetary Sciences",
        "East Asian Studies",
        "Economics",
        "Electrical Engineering",
        "Engineering Mechanics",
        "English",
        "Environmental Engineering",
        "Environmental Science",
        "Environmental Studies",
        "Film & Media Studies",
        "French",
        "General Engineering",
        "German",
        "History",
        "History of Art",
        "History of Science, Medicine & Technology",
        "Interdisciplinary Studies",
        "International Studies",
        "Italian",
        "Materials Science & Engineering",
        "Mathematics",
        "Mechanical Engineering",
        "Medicine, Science & the Humanities",
        "Molecular & Cellular Biology",
        "Natural Sciences",
        "Near Eastern Studies",
        "Neuroscience",
        "Philosophy",
        "Physics",
        "Political Science",
        "Psychology",
        "Public Health Studies",
        "Romance Languages",
        "Sociology",
        "Spanish",
        "Writing Seminars"]


    const account = (
            <Grid container direction={"column"} spacing={2}>
                <Grid item>
                <TextField required id="standard-basic" variant="outlined" label="Email Address" onChange={e => setUsername(e.target.value)}/>
                </Grid>

                <Grid item>
                <TextField type={'password'} required id="standard-basic" variant="outlined" label="Password" onChange={e => setPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                <TextField type={'password'} required id="standard-basic" variant="outlined" label="Confirm Password" onChange={e => setPasswordConfirm(e.target.value)}/>
                <Typography style={{color:"red"}}>
                  {confirmMsg}
                </Typography>
                </Grid>

            </Grid>
    );
    const personalInfo = (
            <Grid container direction={"column"} spacing={2}>
                <Grid item>
                <TextField required id="standard-basic" variant="outlined" label="First Name" onChange={e => setFirst_name(e.target.value)}/>
                </Grid>
                <Grid item>
                <TextField required id="standard-basic" variant="outlined" label="Last Name" onChange={e => setLast_name(e.target.value)}/>
                </Grid>
                <Grid item>
                    <FormControl required variant="outlined" style={{minWidth:220}}>
                    <InputLabel >Gender</InputLabel>
                <Select 
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
                </Grid>
                <Grid item>
                    <FormControl required variant="outlined" style={{minWidth:220}}>
                    <InputLabel >Ethnicity</InputLabel>
                    <Select
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
                </Grid>
                
                <Grid item>
                    <FormControl variant="outlined" style={{minWidth:220}}>
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
        <TextField required 
          {...params}
          label="School"
          variant="outlined"
          value = {school}
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
                    </FormControl>

                </Grid>

                <Grid item>
                <Autocomplete 
                    id="majors"
                    options={majors}
                    style={{ width: 300 }}
                    onChange={(event, newValue) => {
                    setMajor(newValue);
                    }}
                    renderInput={(params) => <TextField required  {...params} label="Major" variant="outlined" />}
                />
                </Grid>

                <Grid item>
                <FormControl required variant="outlined" style={{minWidth:220}}>
                    <InputLabel >Program</InputLabel>
                <Select
                onChange={(e)=>{
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
                <TextField required id="standard-basic" variant="outlined" label="Phone Number" onChange={e => setPhone_number(e.target.value)}/>
                </Grid>

                <Grid item>
                <FormControl required variant="outlined" style={{minWidth:220}}>
                <InputLabel id="demo-simple-select-label">Graduation Month</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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

                <FormControl required variant="outlined" style={{minWidth:220}}>
                <InputLabel id="demo-simple-select-label">Graduation Year</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
                </Grid>

            </Grid >
    );

      
  function getSteps() {
    return ['Account Information', 'Personal Information', 'Confirm Email'];
  }
  
    const VerticalLinearStepper = (

      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {index==0&&account}
                {index==1&&personalInfo}
                {index==2&&<Typography>
                  You should have recieved a confirmation email. Please check your inbox(and spam) and click the link to confirm your email address.
                  </Typography>}
                <div className={classes.actionsContainer}>
                  <div>
                    {activeStep==0&&<Button
                      variant="contained"
                      color="primary"
                      onClick={()=>{
                        handleAccountNext();
                      }}
                      className={classes.button}
                    >
                      Next
                    </Button>}
                    {activeStep==1&&<Button
                      variant="contained"
                      color="primary"
                      onClick={()=>{
                        handleProfileNext();
                      }}
                      className={classes.button}
                    >
                      Create Account
                    </Button>}
                    {activeStep==2&&
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      component={Link} to={'/profile'}
                    >
                      Login
                    </Button>}
                  </div>
                </div>
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
