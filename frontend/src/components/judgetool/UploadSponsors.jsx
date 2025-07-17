import React, { Component } from 'react';
import axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input'; //plugin for displaying selected file
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from '@mui/material/Card';
import { Container } from '@mui/material';

class UploadSponsors extends Component {
  state = {
    file: null
  };

  componentDidMount() {
    bsCustomFileInput.init(); //intialize plugin
  }

  onFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  onFileUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('sponsors_file', this.state.file);
    const myVariable = process.env.REACT_APP_BACKENDURL;

    if (myVariable != '') {
      axios.defaults.baseURL = myVariable;
    }
    try {
      await axios.post('api/judgetool/sponsor-prizes', formData);
      this.props.history.push('/sponsor-prizes');
    } catch (error) {
      if (!this.state.file) {
        alert('Please provide a file.');
      } else {
        alert('Error');
      }
    }
  };

  render() {
    return (
      <Container fixed>
        <Card style={{ backgroundColor: '#d1e9ff' }}>
          <Form action="" name="form" encType="multipart/form-data" onSubmit={this.onFileUpload}>
            <h2>Sponsor prizes (.csv)</h2>
            <Form.File
              name="sponsors_file"
              onChange={this.onFileChange}
              id="custom-file"
              label="Choose file"
              accept=".csv"
              style={{ width: '60%' }}
              custom
            />
            <br /> <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }
}

export default UploadSponsors;
