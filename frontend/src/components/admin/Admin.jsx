import React, {useState,useEffect} from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import SearchBar from "material-ui-search-bar";
import axios from "axios";


const Admin =  function() {
    const [page, setPage] = useState(1);
    const [users, setusers] = useState([]);
    const [query, setQuery] = useState("");
    const [event, setEvent] = useState("");
    const [school, setSchool] = useState("");
    const [status, setStatus] = useState("");

    const handleChange = (event, value) => {
      setPage(value);
    };

    async function getUsers(){
      const response = await axios.get('/api/admin/users' + '?page_num=' + page + '&query=' + query);
      setusers(response.data.users);
    }


    useEffect(() => {
      getUsers()
  }, []);

    const populateUsers = 
        users.map((user, index) => 
          <div key={index} style={{color:"white"}}>
            {index} - {user.first_name} {user.last_name}
          </div>
        );

    return (
      <>
      <SearchBar
    value={query}
    onChange={(newValue) => setQuery(newValue)}
    onRequestSearch={() => getUsers()}
  />
      {populateUsers}
      </>

    );
};

export default withAdminAuthCheck(Admin);



