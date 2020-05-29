import React, {useState, useEffect} from "react";
import axios from "axios";

import {setupAuth, cleanupAuth} from "../util/auth.jsx";

const Profile = function Profile(...props) {
    const [file, setFile] = useState("");
    const [oldName, setOldName] = useState("");

    async function setup() {
        try {
            // Note this will setup axios to use auth header.
            await setupAuth();
            const response = await axios.get("/api/resumes/filename");
            setOldName(response.data["filename"]);
        } catch (error) {
            console.log("No resume found");
        }
    }

    function handleFileChange(e) {
        setFile(e.target.files[0])
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);

        const response = await axios.post("/api/resumes/", data);

    }

    async function handleDownload(e) {
        e.preventDefault();

        const response = await axios.get("/api/resumes/");
        const url = response.data['url'];
        window.open(url, "_blank");
    }

    useEffect(() => {
        setup();
        return cleanupAuth;
    }, [setup]);

    return (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <input type="file" name="file" onChange={handleFileChange}/>
            </div>
            <input type="submit" value="Submit" />
          </form>

          <hr/>
          <p>{oldName}</p>
          <button onClick={handleDownload}>Download</button>
        </div>
    );
}

export default Profile;
