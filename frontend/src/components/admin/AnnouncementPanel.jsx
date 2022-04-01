import React, {useState,useEffect} from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import SchoolAutocomplete from '../account/SchoolAutocomplete'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


const useStyles = makeStyles((theme) => ({

    pagination: {
        marginTop: "3%",
        marginLeft: "40%",
    },

    title: {
        color :"white",
        borderColor : "white !important",
        position: 'flex',
        marginTop: "2.5%",
        marginLeft: "7.5%",
    },

    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    verticalCenter: {
        position: 'flex',
        marginTop: "-2.5%",
        marginLeft: "36.5%",
    },

    cssLabel: {
      color: "white"
    },
    cssOutlinedInput: {
      color: 'white',   // <!-- ADD THIS ONE
      "&$cssFocused $notchedOutline": {
        borderColor: `white !important`
      }
    },
    cssFocused: { color: "white !important" },
  
    notchedOutline: {
      borderColor: "white !important"
    }
  })
);


const Panel = function() {
    const classes = useStyles();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [event, setEvent] = useState("");
    const [sender, setSender] = useState("");
    const [priority, setPriority] = useState("");
    const [open, setOpen] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteTitle, setdeleteTitle] = useState("");
    

    async function getAnnouncements(){
      try{
        const response = await axios.get("/api/announcements/titles");
        setAnnouncements(response.data['announcements']);
        console.log(announcements)
        console.log(response.data['announcements'])
      } catch (ex){
        console.log('Unable to get all announcements');
      }
    }

    function populateAnnouncements() {
      console.log(announcements)
      console.log(announcements)
      return (
        announcements?.map((announcement, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
            {announcement.title}
            </TableCell>
            <Button variant="contained" color="white" margain='center' id={announcement.title} onClick={handleOpenDeleteDialog}> 
                Delete
            </Button>
            <Dialog
              open={openDelete}
              keepMounted
              onClose={handleCloseDeleteDialog}
              aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle>{"You are going to delete the announcement"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
                <p>Title: {deleteTitle}</p>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            < Button onClick={handleCloseDeleteDialog} id="back">Back</Button>
            < Button onClick={handleCloseDeleteDialog} id="confirm">Confirm</Button>
            </DialogActions>
            </Dialog>
          </TableRow>
        ))
      )
    }

    useEffect(() => {
      getAnnouncements()
      populateAnnouncements()
    }, []);

    
    const handleTitleChange = (event) => {
      setTitle(event.target.value)
      console.log(event.target.value);
    };

    const handleContentChange = (event) => {
      setContent(event.target.value)
      console.log(event.target.value);
    };

    const handleEventChange = (event) => {
      setEvent(event.target.value)
      console.log(event.target.value);
    };

    const handleSenderChange = (event) => {
      setSender(event.target.value)
      console.log(event.target.value);
    };

    const handlePriorityChange = (event) => {
      setPriority(event.target.value)
      console.log(event.target.value);
    };

    const handleOpenDialog = () => {
      setOpen(true);
    }

    const handleOpenDeleteDialog = (event) => {
      console.log(event.currentTarget.id)
      setdeleteTitle(event.currentTarget.id)
      setOpenDelete(true);
    }
    
    async function sendAnnouncement() {
      try{
        await axios.post("/api/announcements/", {"title" : title, "content" : content, "event" : event, "broadcast" : "no", "importance" : priority});
        window.location.reload();
      } catch (ex) {
        console.log(ex);
      }
    } 

    async function deleteAnnouncement() {
      try{
        await axios.delete("/api/announcements/", {data: {"title" : deleteTitle}});
        window.location.reload();
      } catch (ex) {
        console.log(ex);
      }
    } 

    const handleCloseDialog = (event) => {
      if (event.currentTarget.id === "confirm") {
        sendAnnouncement();
      }
      setOpen(false);
    }

    const handleCloseDeleteDialog = (event) => {
      if (event.currentTarget.id === "confirm") {
        deleteAnnouncement();
      }
      setOpenDelete(false);
    }

    return (
        <>
        <div>
            <h2 className={classes.title}>
                Announcement Panel
            </h2>
            <div className={classes.verticalCenter}>
            <Button variant="contained" color="white" margain='center' onClick={handleOpenDialog}> 
                Send
            </Button>
            <Dialog
              open={open}
              // TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle>{"Please Confirm The Announcement"}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <p> Title : {title} </p>
              <p> Content : {content} </p>
              <p> Event : {event} </p>
              <p> Sender : {sender} </p>
              <p> Priority : {priority} </p>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            < Button onClick={handleCloseDialog} id="back">Back</Button>
            < Button onClick={handleCloseDialog} id="confirm">Confirm</Button>
            </DialogActions>
            </Dialog>
            </div>

            <div className={classes.root}>
            <div>
        <TextField
          id="outlined-multiline-flexible"
          label="Title"
          rows={2}
          style={{ margin: 8}}
          fullWidth
          color="white"
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            }
          }}
          onChange={handleTitleChange}
        />

        <TextField
          id="outlined-multiline-static"
          label="Content"
          multiline
          fullWidth
          rows={4}
          variant="outlined"
          style={{ margin: 8}}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            }
          }}
          onChange={handleContentChange}
        />
        <div>
        <TextField
          select
          label="Event"
          variant="outlined"
          style={{ margin: 8}}
          className={classes.textField}
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            }
          }}
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }
          }}
          onChange={handleEventChange}
        >
         <MenuItem value={"Fall 2022"}>Fall 2022</MenuItem>
         </TextField>
        <TextField
          label="Sender"
          id="outlined-multiline-flexible"
          className={classes.textField}
          style={{ margin: 8}}
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            }
          }}
          onChange={handleSenderChange}
        />
        <TextField
          label="Priority"
          select
          className={classes.textField}
          style={{ margin: 8}}
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.cssLabel,
              focused: classes.cssFocused,
            },
          }}
          InputProps={{
            classes: {
              root: classes.cssOutlinedInput,
              focused: classes.cssFocused,
              notchedOutline: classes.notchedOutline,
            }
          }}
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left"
              },
              getContentAnchorEl: null
            }
          }}
          onChange={handlePriorityChange}
          >
            <MenuItem value={"Yes"}>Yes</MenuItem>
            <MenuItem value={"No"}>No</MenuItem>
         </TextField>

        </div>
        </div>
        </div>
        </div>

        <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {populateAnnouncements()}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        </>
    );

};

export default withAdminAuthCheck(Panel);

