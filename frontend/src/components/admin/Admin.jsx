import React from "react";
import { withAdminAuth } from "../../util/auth";

const Admin =  function() {
    return (<div> Admin Page </div>);
};

export default withAdminAuth(Admin);
