import React, {useState, useEffect} from "react";
import axios from "axios";

import {withAuth} from "../util/auth.jsx";

const Profile = function Profile(props) {
    const [file, setFile] = useState("");
    const [oldName, setOldName] = useState("");

    async function getFileName() {
        /* If we are not logged in, don't bother trying to access endpoint (we'll get a 401) */
        if (!props.isLoggedIn) return;

        try {
            const response = await axios.get("/api/resumes/filename");
            setOldName(response.data["filename"])
        } catch(e) {
            setOldName("");
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
        // TODO handle error!
    }

    async function handleDownload(e) {
        e.preventDefault();

        const response = await axios.get("/api/resumes/");
        const url = response.data['url'];
        window.open(url, "_blank");
    }

    useEffect(() => {
        getFileName();
    }, [props.isLoggedIn]);

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

export default withAuth(Profile);
