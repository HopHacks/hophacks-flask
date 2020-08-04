import React, { Component } from 'react';
import axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input' //plugin for displaying selected file
import Form from 'react-bootstrap/form';
import Button from 'react-bootstrap/button'

class UploadRooms extends Component {
    state = {
        file : null
    };

    componentDidMount() {
        bsCustomFileInput.init(); //intialize plugin
    }

    onFileChange = event => {
        this.setState({ file: event.target.files[0] });
    };

    onFileUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("room_file", this.state.file);

        try {
            await axios.post("/room-assignments", formData);
            this.props.history.push('/room-assignments');
        } catch(error) {
            if (!this.state.file) {
                alert("Please provide a file.");
            } else {
                alert("Error");
            }
        }
    };

    render() {
        return (
            <Form action = "" name="form" encType="multipart/form-data"
                onSubmit={this.onFileUpload}>

                <h2>Rooms and capacities (.csv)</h2>
                <Form.File
                    name="room_file"
                    onChange={this.onFileChange}
                    id="custom-file"
                    label="Choose file"
                    accept=".csv"
                    style={{width : '60%'}}
                    custom
                />

                <br/> <br/>
                <Button variant="primary" type="submit">
                    Submit
                </Button>

            </Form>
        );
    }
}

export default UploadRooms;
