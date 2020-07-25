import React, {useEffect, useState} from 'react';
import './App.css';
import { Assignments } from './components/Assignments';
import { Table } from './components/Assignments';

function App() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetch('/display').then(response =>
      response.json().then(data => {
        setAssignments(data);
        console.log(data);
        console.log(Object.keys(data));
      })
    );
  }, []);

  return (
    /*<div className="App">
      <Assignments assignments={assignments} />
    </div>*/
    Table t = new Table();
    <Table data={this.state.data}/>
  );

}

export default App;
