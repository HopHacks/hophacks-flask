import React, { useState } from "react";
import axios from "axios";

import Modal from '@material-ui/core/Modal';

import {
    useHistory
} from "react-router-dom";

export default function Login(props) {
    
    /* State for handling login */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [attempted, setAttempted] = useState(false);

    /* State for handling reset password modal */
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    let history = useHistory();

    async function handleLogin(event) {
        event.preventDefault();
        // TODO alert?
        try {
            await props.login(email, password);

            if (email !== "admin") {
                history.push("/profile")
            } else {
                history.push("/admin")
            }
        } catch(error) {
            setAttempted(true);
        }
    }

    async function handleReset(event) {
      event.preventDefault();
      // TODO alert?
      try {
        const response = await axios.post('/api/accounts/reset_password/request', {
          "username": resetEmail,
          "reset_url": window.location.protocol + '//' + window.location.host + '/reset_password'
        });
        alert("An email has been sent!");
      } catch {
        alert("Error requesting password reset");
      }

    }



    const ResetModal = (        
      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      >
        <div>          
          <form onSubmit={handleReset}>
            <label>
              Email:
              <input
                  autoFocus
                  type="text"
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
              />
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
      </Modal>
    )

    return (
      <div className="Hophacks">
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input
                autoFocus
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <p>{attempted ? "Incorrect Username or Password" : ""}</p>
        <button type="button" onClick={() => setResetModalOpen(true)}>
          Reset Password
        </button>

        {ResetModal}

      </div>
    );

}
