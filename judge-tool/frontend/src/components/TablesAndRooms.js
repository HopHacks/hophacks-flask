import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'
import axios from 'axios'

function TablesAndRooms() {
  const [roomAssignment, setRoomAssignment] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('/room-assignments').then(response =>
      response.json().then(data => {
        setRoomAssignment(data);
      })
    );
}, []);

    useEffect(() => {
      axios.get('/table-assignments').then(response =>
        response.json().then(data => {
          setTables(data);
        })
      );
    }, []);

  let rooms = Object.keys(roomAssignment);
  let teams = Object.values(roomAssignment);

  return (
      <div>
        <Table bordered hover>
        <thead>
            <tr>
                <th>Room</th>
                <th>Teams and table numbers</th>
            </tr>
        </thead>

        <tbody>
            {rooms.map(room => {
                return (
                    <tr key={room}>
                        <td>{room}</td>
                        <td>
                            <ul style={{listStyleType:"none", padding:"3px"}}>
                                {teams[rooms.indexOf(room)].map(team => {
                                    return (
                                        <li style={{margin:"2px"}} key={team}>{tables[team]}. {team}</li>
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

export default TablesAndRooms;
