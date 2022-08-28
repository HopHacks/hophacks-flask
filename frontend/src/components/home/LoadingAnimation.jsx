import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

function img(url) {
    return process.env.PUBLIC_URL + '/images/' + url;
}

export default function LoadingAnimation() {    
    return (
        <div>
            <img src={img('dark_blue_bg.jpg')} style={{ position: "fixed", bottom: "0%", right: "0%", width: "100%", height: "100%"}} />
            <img src={img('footer/bluejay-icon.png')} style={{ position: "fixed", bottom: "50%", right: "40%", width: "15%"}} />
            <LinearProgress color="secondary" style={{position: "fixed", bottom: "50%", right:"25%", width: "50%"}}/>
            <h1> Scroll To Start </h1>
        </div>
    );
}