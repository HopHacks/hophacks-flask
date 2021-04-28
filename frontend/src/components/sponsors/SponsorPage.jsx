import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import PrevSponsorListing from "./PrevSponsorListing.jsx";
import HackerStats from "./HackerStats.jsx";

export default class SponsorPage extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: "#000",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: "0",
            right: "0",
            "background-size": "100%",
            background:
              'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("images/f20/parallax_all_no_text.jpg")',
            "-webkit-background-size": "100%",
            "background-repeat": "space",
          }}
        />
        <Typography variant="h5" gutterBottom>
          Sponsors
        </Typography>
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div
                className="card"
                style={{ backgroundColor: "#2C2F33", color: "#fff" }}
              >
                <div className="card-image">
                  <img src="/images/f15/malone.jpg" alt="malone" />
                  <span className="card-title">
                    <span className="roboto-c">
                      <span className="hh-darkblue">HopHacks: </span>
                      Sponsorship
                    </span>
                  </span>
                </div>
                <div className="card-content">
                  <p>
                    We're always looking for awesome companies and organizations
                    to join the HopHacks community. If you're interested in
                    getting involved but the levels described below aren't for
                    you, please{" "}
                    <a href="mailto:sponsors@hophacks.com">reach out to us</a>.
                  </p>
                  <br />
                  <div className="card-action">
                    <div className="right">
                      <Button
                        type="default"
                        size="large"
                        style={{ marginRight: "10px", marginBottom: "10px" }}
                      >
                        <a href="/images/f20/sponsorsf20.pdf">
                          View Sponsorship Levels
                        </a>
                      </Button>
                      <Button type="primary" size="large">
                        <a href="mailto:sponsors@hophacks.com">
                          Become a Sponsor
                        </a>
                      </Button>
                    </div>
                    <br />
                  </div>
                </div>
              </div>
              <HackerStats />
              <PrevSponsorListing />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
