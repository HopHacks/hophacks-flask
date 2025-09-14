import React, { Component } from 'react';
import axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input'; //plugin for displaying selected file
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from '@material-ui/core/Card';
import { Container } from '@material-ui/core';

class Upload extends Component {
  state = {
    judgesFile: null,
    submissionsFile: null,
    roomsFile: null,
    number: 0
  };

  componentDidMount() {
    bsCustomFileInput.init(); //intialize plugin
  }

  onJudgesFileChange = (event) => {
    this.setState({ judgesFile: event.target.files[0] });
  };

  onSubmissionsFileChange = (event) => {
    this.setState({ submissionsFile: event.target.files[0] });
  };

  onRoomsFileChange = (event) => {
    this.setState({ roomsFile: event.target.files[0] });
  };

  onNumberChange = (event) => {
    this.setState({ number: event.target.value });
  };

  onFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('jfile', this.state.judgesFile);
    formData.append('sfile', this.state.submissionsFile);
    formData.append('room_file', this.state.roomsFile);
    formData.append('ifile', this.state.number);

    const myVariable = process.env.REACT_APP_BACKENDURL;

    if (myVariable != '') {
      axios.defaults.baseURL = myVariable;
    }
    try {
      await axios.post('api/judgetool/assignments', formData);
      this.props.history.push('/assignments');
    } catch (error) {
      if (
        !this.state.judgesFile ||
        !this.state.submissionsFile ||
        !this.state.roomsFile ||
        this.state.number === 0
      ) {
        alert('Please fill all fields.');
      } else if (this.state.judgesFile.name.split('.').pop() !== 'txt') {
        alert('Judges file must be .txt');
        bsCustomFileInput.destroy();
      } else if (this.state.submissionsFile.name.split('.').pop() !== 'csv') {
        alert('Submissions file must be .csv');
        bsCustomFileInput.destroy();
      } else {
        alert('Error');
        bsCustomFileInput.destroy();
      }
    }
  };

  render() {
    return (
      <Container
        fixed
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh"
        }}
      >
        <Card
          style={{
            backgroundColor: "#d1e9ff",
            padding: "2rem",
            width: "60%",
            maxWidth: "600px"
          }}
        >
          <Form
            action=""
            name="form"
            encType="multipart/form-data"
            onSubmit={this.onFileUpload}
          >
            <h2>Submissions (.csv)</h2>
            <Form.File
              name="sfile"
              onChange={this.onSubmissionsFileChange}
              id="custom-file"
              label="Choose file"
              accept=".csv"
              style={{ width: "100%" }}
              custom
            />
            <h2>List of judges (.txt)</h2>
            <Form.File
              name="jfile"
              onChange={this.onJudgesFileChange}
              id="custom-file"
              label="Choose file"
              accept=".txt"
              style={{ width: "100%" }}
              custom
            />
            <h2>Number of judges per team</h2>
            <Form.Control
              name="ifile"
              pattern="[0-9]*"
              title="Enter an integer."
              onChange={this.onNumberChange}
              type="text"
              placeholder="Enter a number"
              style={{ width: "100%" }}
            />
            <Form.Text className="text-muted">
              Must be less than or equal to the total number of judges.
            </Form.Text>
            <h2>List of rooms</h2>
            <Form.File
              name="room_file"
              onChange={this.onRoomsFileChange}
              id="custom-file"
              label="Choose file"
              accept=".csv"
              style={{ width: "100%" }}
              custom
            />
            <br /> <br />
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Form>
        </Card>
      </Container>

    );
  }
}

export default Upload;
