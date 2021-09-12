import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'
import axios from 'axios';
import Card from '@material-ui/core/Card';
import { Container } from '@material-ui/core';

function SponsorPrizes() {
  const [prizes, setPrizes] = useState([]);
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('api/judgetool/sponsor-prizes').then(response => {
			setPrizes(response.data);
		});
  }, []);

  useEffect(() => {
    axios.get('api/judgetool/table-assignments').then(response => {
			setTables(response.data);
		});
  }, []);

  useEffect(() => {
    axios.get('api/judgetool/room-assignments').then(response => {
			setRooms(response.data);
		});
  }, []);

  let sponsors = Object.keys(prizes);
  let teams = Object.values(prizes);
  let dict = {};
  const tempTeams = Object.values(rooms);
  for (let i = 0; i < tempTeams.length; i++) {
      for (let j = 0; j < tempTeams[i].length; j++) {
          let list = tempTeams[i];
          if (!(list[j] in dict)) {
              dict[list[j]] = Object.keys(rooms)[i];
          }
      }
  }

  return (
    <Container fixed>
    <Card style={{ backgroundColor: "#d1e9ff" }}>
      <div>
        <Table bordered hover>
        <thead>
            <tr>
                <th>Sponsor prize</th>
                <th>Submission</th>
            </tr>
        </thead>

        <tbody>
            {sponsors.map(sponsor => {
                return (
                    <tr key={sponsor}>
                        <td>{sponsor}</td>
                        <td>
                            <ul style={{listStyleType:"none", padding:"3px"}}>
                                {teams[sponsors.indexOf(sponsor)].map(team => {
                                    return (
                                        <li style={{margin:"2px"}} key={team}>{tables[team]}. {team} ({dict[team]})</li>
                                    )
                                })}
                            </ul>
                        </td>
                    </tr>
                )
            })}
        </tbody>
        </Table>
      </div>
      </Card>
      </Container>
  )

}

export default SponsorPrizes;
