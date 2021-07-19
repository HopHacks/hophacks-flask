import React, {useState,useEffect} from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
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


const useStyles = makeStyles((theme) => ({

  pagination: {
    marginTop: "3%",
    marginLeft: "40%",
  },

}));

const Admin =  function() {
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const [users, setusers] = useState([]);
    const [query, setQuery] = useState("");
    const [event, setEvent] = useState("fall_2021");
    const [status, setStatus] = useState("All");
    const [totalPage, setTotalPage] = useState(1);
    


    const handleChange = (event, value) => {
      setPage(value);
      setusers([]);
      getUsers();
    };

    async function getUsers(){
      const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query + "&event=" + event + "&status=" + status);
      setusers(response.data.users);
      setTotalPage(response.data.totalPage);
    }

    async function acceptUser(){
      const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query + "&event=" + event + "&status=" + status);
    }

    async function rejectUser(){
      const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query + "&event=" + event + "&status=" + status);
    }


    useEffect(() => {
      getUsers()
  }, []);

    const populateUsers = 
        users.map((user, index) => 
          <div key={index} style={{color:"black"}}>
            {index} - {user.profile.first_name} {user.profile.last_name} Email Confirmed:  {user.email_confirmed.toString()} Registrations: {user.registrations} 
            <Button variant="contained" onClick={acceptUser()}>Accept</Button>
            <Button variant="contained" onClick={rejectUser()}>Reject</Button>
          </div>
        );

    const StatusPicker = (
      <FormControl variant="outlined" style={{ minWidth: 220 }}>
                <InputLabel >Status</InputLabel>
                <Select
                  onChange={(e) => {
                    setStatus(e.target.value);
                    getUsers();
                  }}

                  defaultValue={"All"}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Checked in">Checked in</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Waitlisted">Waitlisted</MenuItem>
                  <MenuItem value="Not Accept">Not Accept</MenuItem>
                </Select>
              </FormControl>
          )

    return (
      <Container fixed>
        <Box style={{backgroundColor:"white"}}>
        <SearchBar
    value={query}
    onChange={(newValue) => setQuery(newValue)}
    onRequestSearch={() => getUsers()}
  />

      {StatusPicker}

      {populateUsers}
      <div  className={classes.pagination}>
      <Pagination count={totalPage} page={page} onChange={handleChange} />
      </div>
        </Box>
        </Container>

    );
};

export default withAdminAuthCheck(Admin);



