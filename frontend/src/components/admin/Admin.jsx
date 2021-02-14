import React from "react";
import { withAdminAuthCheck } from "../../util/auth";

const Admin =  function() {
    return (<div> Admin Page </div>);
};

export default withAdminAuthCheck(Admin);
