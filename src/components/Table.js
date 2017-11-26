import React, { Component } from 'react';

class Table extends Component {

  handleOnClick(e){
    this.props.onClick(e.target.id);
  }

  drawTable(){
    if (this.props.table.people !== undefined){
      var tdStyle;

      if (window.innerWidth > 768){
        tdStyle = {
          width: 45 / this.props.table.width + 'vw',
          height: 45 / this.props.table.width + 'vw'
        };
      } else {
        tdStyle = {
          width: 100 / this.props.table.width + 'vw',
          height: 100 / this.props.table.width + 'vw'
        };
      }
      return this.props.table.people.map( (el, id) => {
        var row = el.map( (ppl) => {
          return <td id={ppl.id} key={ppl.id} className={ppl.isAlive ? 'alive' : 'dead'} style={tdStyle} onClick={this.handleOnClick.bind(this)}></td>
        });
        return <tr key={'r'+id}>{row}</tr>;
        });
    }
  }

  render() {
    return (
      <div className="table-container">
        <div className="table">
          <table>
            <tbody>
              {this.drawTable()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Table;
