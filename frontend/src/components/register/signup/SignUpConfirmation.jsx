import React, { useState } from 'react';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Link } from 'react-router-dom';
import MajorAutocomplete from '../../account/MajorAutocomplete';
import SchoolAutocomplete from '../../account/SchoolAutocomplete';
import Checkbox from '@material-ui/core/Checkbox';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

import PhoneInput from 'react-phone-number-input';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneNumber from '../../account/PhoneNumber';

import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import '../../../stylesheets/register.css';
import { useEffect } from 'react';

export default function SignUpConfirmation(props) {
    return (
        <div>
            <h1>Sign Up Confirmation</h1>
        </div>
    );
}