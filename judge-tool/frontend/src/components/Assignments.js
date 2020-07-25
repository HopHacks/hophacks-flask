import React from 'react';

class Table extends React.Component {
  constructor(props){
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.getRowsData = this.getRowsData.bind(this);
    this.getKeys = this.getKeys.bind(this);
  }

  getKeys = function() {
    return ["Judge", "Submission"]
  }

  getHeader = function() {
    let keys = this.getKeys();
    return keys.map((key, index)=>{
      return <th key={key}>{key}</th>
    })
  }

  getRowsData = function(){
    var items = this.props.data;
    var keys = this.getKeys();
    return items.map((row, index)=>{
      return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
    })
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>{this.getHeader()}</tr>
          </thead>
          <tbody>
            {this.getRowsData()}
          </tbody>
        </table>
      </div>
    );}
}

const RenderRow = (props) =>{
  return props.keys.map((key, index)=>{
    return <td key={props.data[key]}>{props.data[key]}</td>
  })
}

const t = new Table({assignments});
export default t;

/*export const Assignments = ({assignments}) => {
  return (
    <div>assignments</div>
  )
}*/
