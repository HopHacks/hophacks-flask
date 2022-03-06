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
        position: 'absolute',
        marginTop: "-2.5%",
        marginLeft: "36.5%",
    }
}));


const Panel = function() {
    const classes = useStyles();
    const [page, setPage] = useState(1);
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
          defaultValue="Please Enter the Title"
          style={{ margin: 8}}
          fullWidth
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
            },
          }}
          InputProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
              notchedOutline: classes.title,
            },
          }}
        />

        <TextField
          id="outlined-multiline-static"
          label="Content"
          multiline
          fullWidth
          rows={4}
          defaultValue="Please Enter the Content"
          variant="outlined"
          style={{ margin: 8}}
          InputLabelProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
            },
          }}
          InputProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
              notchedOutline: classes.title,
            },
          }}
        />
        <div>
        <TextField
          label="Event"
          id="outlined-multiline-flexible"
          defaultValue="Fall 2022"
          variant="outlined"
          style={{ margin: 8}}
          className={classes.textField}
          InputLabelProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
            },
          }}
          InputProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
              notchedOutline: classes.title,
            },
          }}
        />
        <TextField
          label="Sender"
          id="outlined-multiline-flexible"
          defaultValue="Enter the Sender"
          className={classes.textField}
          style={{ margin: 8}}
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
            },
          }}
          InputProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
              notchedOutline: classes.title,
            },
          }}
        />
        <TextField
          label="Priority"
          id="outlined-multiline-flexible"
          defaultValue="Y / N"
          className={classes.textField}
          style={{ margin: 8}}
          variant="outlined"
          InputLabelProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
            },
          }}
          InputProps={{
            classes: {
              root: classes.title,
              focused: classes.title,
              notchedOutline: classes.title,
            },
          }}
        />
        </div>
        </div>
        </div>
        </div>
        </>
    );

};

export default withAdminAuthCheck(Panel);