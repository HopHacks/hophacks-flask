import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'
import axios from 'axios';

function SponsorPrizes() {
  const [prizes, setPrizes] = useState([]);
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('/sponsor-prizes').then(response => {
			setPrizes(response.data);
		});
  }, []);

  useEffect(() => {
    axios.get('/table-assignments').then(response => {
			setTables(response.data);
		});
  }, []);

  useEffect(() => {
    axios.get('/room-assignments').then(response => {
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
  )

}

export default SponsorPrizes;
