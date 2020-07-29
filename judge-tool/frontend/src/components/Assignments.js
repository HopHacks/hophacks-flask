import React, {useEffect, useState} from 'react';
import Table from 'react-bootstrap/Table'

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    fetch('/assignments').then(response =>
      response.json().then(data => {
        setAssignments(data);
      })
    );
  }, []);

  useEffect(() => {
    fetch('/table-assignments').then(tables =>
      tables.json().then(data => {
        setTables(data);
      })
    );
  }, []);

  const judges = Object.keys(assignments);
  const submissions = Object.values(assignments);

  return (
      <div>
        <Table bordered hover>
        <thead>
            <tr>
                <th>Judge</th>
                <th>Submissions and table numbers</th>
            </tr>
        </thead>

        <tbody>
            {judges.map(judge => {
                return (
                    <tr key={judge}>
                        <td>{judge}</td>
                        <td>
                            <ul style={{listStyleType:"none", padding:"3px"}}>
                                {submissions[judges.indexOf(judge)].map(sub => {
                                    return (
                                        <li style={{marginBottom:"2px"}} key={sub}>{tables[sub]}. {sub}</li>
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

export default Assignments;
