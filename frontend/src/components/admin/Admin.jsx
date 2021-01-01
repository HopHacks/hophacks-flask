import React from "react";
import { withAdminAuth } from "../../util/auth";
import Blacklist from "../Blacklist"

import { Link } from "react-router-dom";

const Admin =  function() {
    return (<div> Admin Page <br></br> 
    
    <Link to="/blacklist">Blacklist</Link>
    
    </div>);
};

export default withAdminAuth(Admin);
