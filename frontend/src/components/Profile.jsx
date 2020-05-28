import React, {useState, useEffect} from "react";
import axios from "axios";

import {withAuth} from "../util/auth.jsx";

const Profile = function Profile() {
    const [file, setFile] = useState("");
    const [oldName, setOldName] = useState("");

    // TODO this doesn't work because it fires before auth.
    useEffect(async () => {
        const response = await axios.get("/api/resumes/filename");
        setOldName(response.data["filename"]);
    }, [setOldName]);


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
