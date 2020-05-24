import React from "react";
import {withAuth} from "../../util/auth.jsx"

const admin =  function() {
    return (<div> Admin Page </div>);
};

export default withAuth(admin, true);
