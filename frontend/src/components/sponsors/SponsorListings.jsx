import React, { Component } from 'react';
import { Link } from 'react-router';
import { Meteor } from 'meteor/meteor';
import { Button } from 'antd';

import SponsorItem from './SponsorItem.jsx';

export default class SponsorListing extends Component {
    render() {
        const settings = Meteor.settings.public;
        return (

            <div className="card light-theme lighten blue-text center-wrapper">
                <div className="card-content">
                    <div className="card-title center-wrapper">
                        <span className="quadon blue-text">{settings.current_event} Sponsors &amp; Partners</span>
                    </div>
                    <p className="center-wrapper">We are excited to welcome sponsors from previous years, as well as new partners, to the HopHacks community!</p>
                    <br />
                    <div className="sponsors">
                        <div className="center-wrapper blue-line" />
                        <div className="sponsors-container">
                            <div className="logos" id="gold-logos">
                                <SponsorItem level="gold" name="bloomberg" url="https://www.bloomberg.com/" imageurl="bloomberg.png" />
                                <SponsorItem level="gold" name="northropgrumman" url="https://www.northropgrumman.com/Pages/default.aspx" imageurl="northropgrumman.png" />
                                <SponsorItem level="gold" name="bytelion" url="https://www.bytelion.com/" imageurl="bytelion.png" />
                            </div>
                            <div className="logos" id="sable-logos">
                                <SponsorItem level="sable" name="twilio" url="https://www.twilio.com/" imageurl="twilio.svg" />
                                <SponsorItem level="sable" name="siemens" url="https://usa.healthcare.siemens.com/about-us" imageurl="siemens.png" />
                                <SponsorItem level="sable" name="ffu" url="https://ventures.jhu.edu/fastforward-u/" imageurl="FastForwardU-PNG-Logo.png" />
                                <SponsorItem level="sable" name="jhuapl" url="http://www.jhuapl.edu/employment/" imageurl="jhuapl.png" />
                                <SponsorItem level="sable" name="hopkins_cs" url="https://www.cs.jhu.edu/" imageurl="jhu-wse.png" />
                                <SponsorItem level="sable" name="hopkins_it" url="http://www.it.johnshopkins.edu/index.html" imageurl="it@jhu.png" />
                                <SponsorItem level="sable" name="alumni" url="https://alumni.jhu.edu/" imageurl="alumniassociation.png" />
                            </div>

                            <div className="logos" id="blue-starter-logos">
                                <SponsorItem level="blue" name="google_cloud" url="https://cloud.google.com/" imageurl="google_cloud.png" />
                                <SponsorItem level="blue" name="digitalocean" url="https://www.digitalocean.com/" imageurl="digital_ocean.png" />
                                <SponsorItem level="blue" name="linode" url="https://www.linode.com/" imageurl="linode-logo.png" />
                                <SponsorItem level="blue" name="oracle" url="https://cloud.oracle.com/data-cloud" imageurl="oracle.png" />
                                <SponsorItem level="blue" name="brl-cad" url="https://brlcad.org/" imageurl="brl-cad.png" />
                            </div>
                        </div>
                    </div>
                    <div className="center-wrapper">
                        <Button type="primary" size="large"><Link to="/sponsors">Become a Sponsor</Link></Button>
                    </div>
                </div>
            </div>
        );
    }
}