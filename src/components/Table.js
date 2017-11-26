import React, { Component } from 'react';

class Table extends Component {

  drawTable(){
    if (this.props.table.people !== undefined){
      return this.props.table.people.map( (el) => {
        var row = el.map( (ppl) => {
          return <td key={ppl.key} className={ppl.isAlive ? 'alive' : 'dead'}></td>
        });
        return <tr>{row}</tr>;
        });
    }
  }

  render() {
    return (
      <div className="table">
        <table>
          <tbody>
            {this.drawTable()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
