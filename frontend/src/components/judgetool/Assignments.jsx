import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Card from '@mui/material/Card';
import { Container } from '@mui/material';

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [tables, setTables] = useState([]);
  const [rooms, setRooms] = useState([]);

  const myVariable = process.env.REACT_APP_BACKENDURL;

  if (myVariable != '') {
    axios.defaults.baseURL = myVariable;
  }

  useEffect(() => {
    axios.get('api/judgetool/assignments').then((response) => {
      setAssignments(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('api/judgetool/table-assignments').then((response) => {
      setTables(response.data);
    });
  }, []);

  useEffect(() => {
    axios.get('api/judgetool/room-assignments').then((response) => {
      setRooms(response.data);
    });
  }, []);

  const judges = Object.keys(assignments);
  const submissions = Object.values(assignments);
  let dict = {};
  const teams = Object.values(rooms);
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams[i].length; j++) {
      let list = teams[i];
      if (!(list[j] in dict)) {
        dict[list[j]] = Object.keys(rooms)[i];
      }
    }
  }

  return (
    <Container fixed>
      <Card style={{ backgroundColor: '#d1e9ff' }}>
        <div>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Judge</th>
                <th>Submissions</th>
              </tr>
            </thead>

            <tbody>
              {judges.map((judge) => {
                return (
                  <tr key={judge}>
                    <td>{judge}</td>
                    <td>
                      <ul style={{ listStyleType: 'none', padding: '3px' }}>
                        {submissions[judges.indexOf(judge)].map((sub) => {
                          return (
                            <li style={{ marginBottom: '2px' }} key={sub}>
                              {tables[sub]}. {sub} ({dict[sub]})
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}

export default Assignments;
