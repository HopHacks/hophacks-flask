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
    const [school, setSchool] = useState("");
    const [status, setStatus] = useState("All");
    const [totalPage, setTotalPage] = useState(1);
    


    const handleChange = (event, value) => {
      setPage(value);
      setusers([]);
      getUsers();
    };

    async function getUsers(){
      const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query + "&event=" + event + "&status=" + status + "&school=" + school);
      setusers(response.data.users);
      setTotalPage(response.data.totalPage);
    }


    useEffect(() => {
      getUsers()
  }, []);

    const populateUsers = 
        users.map((user, index) => 
          <div key={index} style={{color:"black"}}>
            {index} - {user.first_name} {user.last_name} 
          </div>
        );

    const EventPicker = (
<FormControl variant="outlined" style={{ minWidth: 220 }}>
          <InputLabel >Event</InputLabel>
          <Select
            onChange={(e) => {
              setEvent(e.target.value);
              getUsers();
            }}
            defaultValue={"fall_2021"}
          >
            <MenuItem value="fall_2021">Fall 2021</MenuItem>
            <MenuItem value="fall_2020">Fall 2020</MenuItem>
            <MenuItem value="fall_2019">Fall 2019</MenuItem>
            <MenuItem value="spring_2019">Spring 2019</MenuItem>
            <MenuItem value="fall_2018">Fall 2018</MenuItem>
            <MenuItem value="spring_2018">Spring 2018</MenuItem>
            <MenuItem value="fall_2017">Fall 2017</MenuItem>
            <MenuItem value="spring_2017">Spring 2017</MenuItem>
            <MenuItem value="fall_2016">Fall 2016</MenuItem>
            <MenuItem value="spring_2016">Spring 2016</MenuItem>
            <MenuItem value="fall_2015">Fall 2015</MenuItem>
            <MenuItem value="spring_2015">Spring 2015</MenuItem>
          </Select>
        </FormControl>
    )

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

        {EventPicker}
      {StatusPicker}
      <SchoolAutocomplete   
      school={school}
      setSchool={setSchool}/>

      {populateUsers}
      <div  className={classes.pagination}>
      <Pagination count={totalPage} page={page} onChange={handleChange} />
      </div>
        </Box>
        </Container>

    );
};

export default withAdminAuthCheck(Admin);



