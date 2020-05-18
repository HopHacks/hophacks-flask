import React from "react";
import {withAuth} from "../utils/auth.jsx";

const Profile = function Profile() {
    return (<div> This is the user profile, you must be logged in to view this page </div>);
}

export default withAuth(Profile);
