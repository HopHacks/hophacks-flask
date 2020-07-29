import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'

function TableAssignments() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch('/table-assignments').then(response =>
      response.json().then(data => {
        setTables(data);
      })
    );
}, []);


  let teams = Object.keys(tables);
  let numbers = Object.values(tables);

  return (
      <div>
        <Table bordered hover>
            <thead>
                <tr>
                    <th>Project</th>
                    <th>Table number</th>
                </tr>
            </thead>

            <tbody>
                {teams.map(team => {
                    return (
                        <tr key={team}>
                            <td>{team}</td>
                            <td>{numbers[teams.indexOf(team)]}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
      </div>
  )

}

export default TableAssignments;
