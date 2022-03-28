import React, {useState,useEffect} from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
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
        borderColor : "white !important"
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
    return (
        <>
        <div>
            <h2 className={classes.title}>
                Announcement Panel
            </h2>
            <div className={classes.verticalCenter}>
            <Button variant="contained" color="white" margain='center'>
                Send
            </Button>
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
        </>
    );

};

export default withAdminAuthCheck(Panel);

