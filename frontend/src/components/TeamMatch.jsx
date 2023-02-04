import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import axios from "axios";
import { withAuthCheck } from "../util/auth.jsx";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';


const TeamMatch = function TeamMatch(props) {
    
    const [allTeams, setAllTeams] = useState([]);
    const [username, setUsername] = useState("");
    const [createDialog, setCreateDialog] = useState(false);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamInfo, setTeamInfo] = useState("");
    const [displayNum, setDisplayNum] = useState(0);

    async function getAllTeams() {
        try {
          const response = await axios.get('/api/teams/');
          console.log(response.data.teams);
          setAllTeams(response.data.teams);
        } catch (ex) {
          console.log("Unable to get all Teams");
        }
    }
    async function getUsername() {
        if (!props.isLoggedIn) return;
        const response = await axios.get('/api/accounts/profile/getUsername');
        setUsername(response.data.username);
        console.log(response.data);
    }

    const handleSubmit = () => {
        const team = {
            team_name: teamName,
            team_information: teamInfo,
            event: "Hophacks 2023",
            status: "open",
         }
         try {
            console.log(team)
            axios.post("/api/teams/", team);
            console.log(teamName);
            window.location.reload();
            setCreateDialog(false);
        } catch (ex) {
            console.log(ex);
        }

    }


    const handleJoin = (e) => {
        const item = allTeams[e.currentTarget.value];
        const join = {
            team_name: item.team_name,
            team_admin: item.team_admin,
         }
         try {
            axios.put("/api/teams/join", join);
            window.location.reload();
        } catch (ex) {
            console.log(ex);
        }

    }
    

    useEffect(() => {
        getUsername();
        getAllTeams();
    }, []);

    const openCreateDialog = () => {
        setCreateDialog(true);
      };
    
    const closeCreateDialog = () => {
        setCreateDialog(false);
    };

    const openDisplayDialog = (e) => {
        setDisplayNum(e.currentTarget.value);
        setDisplayDialog(true);
      };
    
    const closeDisplayDialog = () => {
        setDisplayDialog(false);
    };


    function displayTeam() {
        return(
        <Dialog open={displayDialog} onClose={closeDisplayDialog}>
            <DialogTitle>Team {allTeams[displayNum].team_name}</DialogTitle>
            <DialogContent>
            <DialogContentText>
                Team Information: {allTeams[displayNum].team_information}
            </DialogContentText>
            <DialogContentText>
                Team Admin: {allTeams[displayNum].team_admin}
            </DialogContentText>
            <DialogContentText>
                Team Members: {allTeams[displayNum].team_members.map((member, index) => {
                    return(
                        <div>
                        {member}
                        </div>
                    );
                })}
            </DialogContentText>
            <DialogContentText>
                Team Status: {allTeams[displayNum].status}
            </DialogContentText>
        
         
            </DialogContent>
            <DialogActions>
            <Button onClick={closeDisplayDialog}>Cancel</Button>
            </DialogActions>
            </Dialog>
        );
    }

  
    



    function createTeam() {
        return(
            <div>
            <Button size="small" onClick={openCreateDialog} style={{
                borderRadius: 35,
                backgroundColor: "#21b6ae",
                padding: "18px 36px",
                fontSize: "18px",
            }}>Create Team</Button> 
            
            <Dialog open={createDialog} onClose={closeCreateDialog}>
            <DialogTitle>Create a Team</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To create a team, please enter all the relevant information below. Interested participants can join your team.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Team Name"
                type="email"
                fullWidth
                variant="standard"
                onChange={e => {setTeamName(e.target.value)}}
            />
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Team Information"
                type="email"
                fullWidth
                variant="standard"
                onChange={e => {setTeamInfo(e.target.value)}}
            />
         
                </DialogContent>
                <DialogActions>
                <Button onClick={closeCreateDialog}>Cancel</Button>
                <Button onClick={handleSubmit}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>

        );
    }



  return (
    <div style={{
      backgroundImage: `url("${process.env.PUBLIC_URL}/images/cover.png")`,
      backgroundSize: 'cover',
      minHeight: "100vh"
    }}>
    
    <div class="container">
        {createTeam()}
    </div>
    {allTeams.map((team, index) => {
        
        return (
           <div>
            <Card sx={{ width: 300 }}>
                        <CardMedia
                        sx={{ height: 300 }}
                        image="../../public/images/logo2022.png"
                        title="green iguana"
                    />
                    <CardContent sx={{ width: 300 }}>
                        <Typography gutterBottom variant="h5" component="div">
                        {team.team_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        {team.team_information}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        {team.team_admin === (username) || team.team_members.includes(username) ?  <Button size="small" disabled>Joined</Button> :  <Button size="small" value={index} onClick={handleJoin}>Join</Button>}
                        <Button size="small" value={index} onClick={openDisplayDialog}>Learn More</Button>
                    </CardActions>
            </Card>
            {displayTeam()}
            
            </div>
        
        );
    })}
    </div>
   
                    

  )
}

export default withAuthCheck(TeamMatch);