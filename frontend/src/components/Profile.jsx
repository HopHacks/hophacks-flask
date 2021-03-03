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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import '../stylesheets/profile.css';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Divider } from '@material-ui/core';

const Profile = function Profile(props) {

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


    const uploadDocument =
    (
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
    )


    const appStatus = (
        <Card className='root' variant="outlined">
            <CardContent>
              <Typography className='title' gutterBottom style={{fontSize:'30px'}}>
                Application
              </Typography>
              <Typography color="textSecondary" style={{fontSize:'15px'}} >
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
                {!confirmed && 
            <button onClick={sendConfirmationEmail}>Request Email Confirmation</button>
            }
        {!confirmed && 
        <p>{sendConfimationMsg}</p>
        }
        {confirmed && status === "not applied" &&
        <button onClick={applyToCurrentEvent}>Apply For Current Hackathon</button>
        }
                {confirmed && status === "applied" &&
        <p>You have applied to the current event</p>
        }
        <p>{msg}</p>
        {status === "accepted" &&
          <Link to="/rsvp">RSVP</Link>}
            </div>
                    </TableCell>
                </TableRow>
            </Table>
            </CardContent>

          </Card>
    )

    const resume = (
<Card className='root' variant="outlined">
            <CardContent>
              <Typography className='title' gutterBottom style={{fontSize:'30px'}}>
                Resume
              </Typography>
              <Typography color="textSecondary" style={{fontSize:'15px'}} >
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
                        {oldName}
                    </TableCell>
                    <TableCell>
                        
                        <Link onClick = {handleDownload} style={{fontSize:'15px', color: 'blue'}}>
                            Download
                        </Link>
                    </TableCell>
                    <TableCell>
                            <form onSubmit={handleSubmit}>
            <div>
            <input type="file" name="file" onChange={handleFileChange}/>
            </div>
            <input type="submit" value="Submit" />
        </form>
                    </TableCell>
                </TableRow>
            </Table>
            </CardContent>

          </Card>
        );

    function NameFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Name</DialogTitle>
              <DialogContent>
              <form>
              <TextField id="standard-basic" variant="outlined" label="First Name" defaultValue= {profile.first_name} onChange={e => setFirst_name(e.target.value)}/>
              <TextField id="standard-basic" variant="outlined" label="Last Name" defaultValue= {profile.last_name} onChange={e => setLast_name(e.target.value)}/>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.first_name = first_name;
                    profile.last_name = last_name;
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function GenderFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Gender</DialogTitle>
              <DialogContent>
              <form>
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
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.gender = gender
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }
      
      function EthnicityFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Ethnicity</DialogTitle>
              <DialogContent>
              <form>
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
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.ethnicity = ethnicity
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function SchoolFormDialog() {
        const [dialogopen, setdialogOpen] = React.useState(false);
      
        const handleClickOpen = () => {
            setdialogOpen(true);
        };
      
        const handleClose = () => {
            setdialogOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={dialogopen} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit School</DialogTitle>
              <DialogContent>
              <form>
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
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.school = school
                    if (school === "Johns Hopkins University"){
                        profile.is_jhu = true;
                    }
                    else{
                        profile.is_jhu = false;
                    }
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function MajorFormDialog() {
        const [dialogopen, setdialogOpen] = React.useState(false);
      
        const handleClickOpen = () => {
            setdialogOpen(true);
        };
      
        const handleClose = () => {
            setdialogOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={dialogopen} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Major</DialogTitle>
              <DialogContent>
              <form>
                <Autocomplete
                    id="majors"
                    options={majors}
                    style={{ width: 300 }}
                    onChange={(event, newValue) => {
                    setMajor(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Major" variant="outlined" />}
                />
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.major = major;
                    handleProfileSave();
                    handleClose();
                    }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function ProgramFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Program</DialogTitle>
              <DialogContent>
              <form>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Program</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={grad}
                onChange={(e)=>{
                    setGrad(e.target.value);
                }}
                >
                <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                <MenuItem value="Graduate">Graduate</MenuItem>
                <MenuItem value="Postgraduate">Postgraduate</MenuItem>
                </Select>
            </FormControl>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.grad = grad
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function PhoneNumberFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Phone Number</DialogTitle>
              <DialogContent>
              <form>
              <TextField id="standard-basic" variant="outlined" label="Phone Number" defaultValue= {profile.phone_number} onChange={e => setPhone_number(e.target.value)}/>
                </form>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.phone_number = phone_number;
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

      function GraduationFormDialog() {
        const [open, setOpen] = React.useState(false);
      
        const handleClickOpen = () => {
          setOpen(true);
        };
      
        const handleClose = () => {
          setOpen(false);
        };
      
        return (
          <div>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Edit Graduation Date</DialogTitle>
              <DialogContent>
              <form>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Month</InputLabel>
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
                </form>

                <form>
                <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
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
                </form>

              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={()=>{
                    profile.grad_month = grad_month
                    profile.grad_year = grad_year
                    handleProfileSave();
                    handleClose();

                }}
                 color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      }

    const ProfileCard = 
    (
          <Card className='root' variant="outlined">
            <CardContent>
              <Typography className='title' gutterBottom style={{fontSize:'30px'}}>
                Profile
              </Typography>
              
              <List className='list'>
              <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Name" secondary={profile.first_name+" "+profile.last_name}  />
        <CardActions>
        <IconButton>
          {NameFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />

      <ListItem button>

        <ListItemText primary="Gender" secondary={profile.gender} />
        <CardActions>
        <IconButton>
        {GenderFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Ethnicity" secondary={profile.ethnicity} />
        <CardActions>
        <IconButton>
        {EthnicityFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="School" secondary={profile.school} />
        <CardActions>
        <IconButton>
          {SchoolFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Major" secondary={profile.major} />
        <CardActions>
        <IconButton>
          {MajorFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Program" secondary={profile.grad} />
        <CardActions>
        <IconButton>
          {ProgramFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Expected Graduation Date" secondary= {profile.grad_month+"/"+profile.grad_year} />
        <CardActions>
        <IconButton>
          {GraduationFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem button>

        <ListItemText primary="Phone Number" secondary={profile.phone_number} />
        <CardActions>
        <IconButton>
          {PhoneNumberFormDialog()}
        </IconButton>
        </CardActions>
      </ListItem>
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
                {ProfileCard}
            </div>
        </div>
    );
}

export default withAuthCheck(Profile);
