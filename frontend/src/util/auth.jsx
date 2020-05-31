import React from "react";
import axios from "axios";
import { useEffect, useState } from 'react'
import { Redirect } from "react-router-dom";


function withAuth(WrappedComponent) {
    return function(props) {
        return (
         <div>
            {props.isLoggedIn === null ? <p>Checking login...</p>
             : (props.isLoggedIn === false ? <Redirect to="/login"/>
             : <WrappedComponent {...props}/>)}
         </div>
        );
    };
};

function withAdminAuth(WrappedComponent) {
    return function(props) {
        const [isAdmin, setIsAdmin] = useState();

        async function checkAdmin() {
            try {
                await axios.get("/api/admin/");
                setIsAdmin(true);
            } catch(e) {
                setIsAdmin(false);
            }
        };

        useEffect(() => {
            checkAdmin();
        }, [props.isLoggedIn])

        return (
         <div>
            {isAdmin === null ? <p></p>
             : (isAdmin === false ? <Redirect to="/"/>
             : <WrappedComponent {...props}/>)}
         </div>
        );
    };
}

export {withAuth, withAdminAuth};
