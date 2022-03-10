import React, { useState, useEffect } from "react";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import list from "./list.json"
const SchoolAutocomplete = function SchoolAutocomplete({
    school,
    setSchool,
}) {

    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = open && options.length === 0;
    // for school autocomplete
    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            //const response = await axios.get('http://universities.hipolabs.com/search');
            //console.log(response)
            const response = require("./list.json")
            const colleges = await response;
            //const colleges = await response.data;
            if (active) {
                setOptions(Object.keys(colleges).map((key) => colleges[key]));
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    return (
        <Autocomplete
            id="schools"
            style={{ width: 250 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            onChange={(event, newValue) => {
                setSchool(newValue !== null ? newValue.name : "");
            }}
            renderInput={(params) => (
                <TextField
                    required
                    {...params}
                    label="School"
                    variant="outlined"
                    value={school}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    )
}
export default SchoolAutocomplete;