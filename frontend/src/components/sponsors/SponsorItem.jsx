import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default class SponsorListing extends Component {
    render() {
        return (
            <div className={`sponsor-${this.props.level}`}>
                <Link to={this.props.url} target="_blank" rel="noopener noreferrer">
                    <img className={`img-${this.props.level}`} src={`/images/logos/color/${this.props.imageurl}`} alt={this.props.imageurl} />
                </Link>
            </div>
        );
    }
}

SponsorListing.propTypes = {
    level: PropTypes.string.isRequired,
    url: PropTypes.string,
    imageurl: PropTypes.string,
};