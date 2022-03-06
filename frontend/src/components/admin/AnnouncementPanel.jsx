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
        color:"white"
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

            <div className={classes.root}>
            <div>
        <TextField
          id="standard-full-width"
          label="Label"
          style={{ margin: 8}}
          placeholder="Placeholder"
          helperText="Full width!"
          fullWidth
          margin="normal"
          color='white'
          InputProps={{
            shrink: true,
            className : 'title'
          }}
        />
        <TextField
          label="None"
          id="margin-none"
          defaultValue="Default Value"
          className={classes.textField}
          helperText="Some important text"
        />
        <TextField
          label="Dense"
          id="margin-dense"
          defaultValue="Default Value"
          className={classes.textField}
          helperText="Some important text"
          margin="dense"
        />
        <TextField
          label="Normal"
          id="margin-normal"
          defaultValue="Default Value"
          className={classes.textField}
          helperText="Some important text"
          margin="normal"
        />
        </div>
        </div>
        </div>
        </>
    );

};

export default withAdminAuthCheck(Panel);