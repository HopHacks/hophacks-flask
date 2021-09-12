import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import Card from '@material-ui/core/Card';
import { Container } from '@material-ui/core';

function TablesAndRooms() {
  const [roomAssignment, setRoomAssignment] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get('api/judgetool/room-assignments').then(response => {
  		setRoomAssignment(response.data);
		});
	}, []);

	useEffect(() => {
		axios.get('api/judgetool/table-assignments').then(response =>{
			setTables(response.data);
		});
    }, []);
    console.log(tables);

  let rooms = Object.keys(roomAssignment);
  let teams = Object.values(roomAssignment);

  return (
    <Container fixed>
    <Card style={{ backgroundColor: "#d1e9ff" }}>
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
    </Card>
    </Container>
  )

}

export default TablesAndRooms;
