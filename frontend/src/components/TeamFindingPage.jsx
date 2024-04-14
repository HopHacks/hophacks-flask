import React, { useEffect, useState } from "react";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import '../stylesheets/teamfinding.css'

const useStyles = makeStyles({
    margin: {
      marginBottom: '20px'
    },
    title: {
      color: '#000000',
      fontFamily: 'PT Sans'
    },
    button: {
      color: '#841584'
    },
    btn_text: {
      color: '#ffffff'
    }
  });

export default function TeamFindingPage() {
  const [teams, setTeams] = useState([
    { id: 1, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 2, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 3, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 4, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 5, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 6, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 7, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
    { id: 8, leader: "Jane Doe", teamName: "Freshmen Gosling", occupancy: "2/4" },
  ]);

  const [year, setYear] = useState('');
  const [skill, setSkill] = useState('');
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  // Function to filter teams based on selected criteria
  const filterTeams = () => {
    // Implement your filtering logic here
  };

  return (
    <div className="App">
      <h1>browse potential friends/teammates!</h1>
      <div className="filters">
        <div className="dropdowns">
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
          </select>
          <select value={skill} onChange={(e) => setSkill(e.target.value)}>
            <option value="">Select Skill</option>
            <option value="newbie">Newbie</option>
            <option value="experienced">Experienced</option>
            <option value="hackathon hunters">Hackathon Hunters</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="open for recruit">Open for Recruit</option>
          </select>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={filterTeams}>Search</button>
        </div>
      </div>
      <div className="teamHolderContainer">
        {teams.map((team) => (
          <div key={team.id} className="teamHolder">
            <button style={{ width: '300px', height: '300px', margin: '15px' }}>
              <p>Leader: {team.leader}</p>
              <p>Team Name: {team.teamName}</p>
              <p>Occupancy: {team.occupancy}</p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
