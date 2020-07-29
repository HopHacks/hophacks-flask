import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'

function SponsorPrizes() {
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    fetch('/sponsor-prizes').then(response =>
      response.json().then(data => {
        setPrizes(data);
      })
    );
  }, []);

  let sponsors = Object.keys(prizes);
  let teams = Object.values(prizes);

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
                                        <li style={{margin:"2px"}} key={team}>{team}</li>
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
