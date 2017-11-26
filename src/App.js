import React, { Component } from 'react';
import Button from './components/Button';
import Table from './components/Table';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      table : {
        height: 10,
        width: 20,
        people: []
      },
      generation: 0,
      isSimulate: false
    }
  }

  componentDidMount(){
    this.setInitialState(50, 30);
  }

  handleSetTableSize(size){
    let dimensions = size.split('x');
    this.setInitialState(parseInt(dimensions[0], 10), parseInt(dimensions[1], 10));
  }

  setInitialState(width, height){
    // set the actual table's width and height
    var table = {
      width: width,
      height: height
    };
    // set up an empty array for the population
    table.people = [];
    // initialize the profile of a new people
    let people = {
      isAlive: true
    }
    // generate the table
    for (let i = 0; i < height; i++){
      //generate rows
      let row = [];
      for (let j = 0; j < width; j++){
        people = {
          isAlive: Math.round(Math.random()) === 1 ? true : false
        }
        row.push(people);
      }
      table.people.push(row);
    }

    // store the table as a new state
    clearInterval(this.intervalId);
    this.setState({
      table: table,
      generation: 0,
      isSimulate: false
    });
  }

  setNewGeneration(){
    let table = this.state.table;
    let population = table.people;
    let newPopulation; // this will be the new table
    let newRow;
    // rid = row index
    // cid = col index
    newPopulation = population.map( (oneRow, rid) => {
      newRow = oneRow.map( (ppl, cid) => {

        return ppl = {
          isAlive: this.willHeAlive(rid, cid)
        }
      });
      return newRow;
    });
    table.people = newPopulation;

    this.setState({
      table: table,
      generation: this.state.generation + 1
    })
  }

  willHeAlive(x, y){
    // nStat = neightbourStatus
    let nStat = 0;
    let table = this.state.table.people;
    let current = table[x][y].isAlive;
    /*
      Okay, let me explain my thought.
      You have to examine the status of the neighbours.

      O|0|0
      0|X|0
      0|0|0

      You are the X. So you have to examine the one step back, the currenent indexed and the one step forwarded rows and cols.
      But, at first, you have to check, if the given row or col exist
    */
    for (let i = -1; i < 2; i++)
      if (table[x+i] !== undefined)
        /*
          The for loop will check from -1 to +1 the rows, and the IF will skip the unexisting elements
        */
        for (let j = -1; j < 2; j++)
          if (table[x+i][y+j] !== undefined && table[x+i][y+j].isAlive === true && !(i == 0 && j == 0))
            /*
              Like the previous case, this FOR and IF do the same, but we check the "alive" status of the neighbours
            */
            nStat++;

    if (current === true){
      if (nStat < 2 || // Rule 1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
          nStat > 3) // Rule 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
          {
            return false;
          } else  // Rule 2. Any live cell with two or three live neighbours lives on to the next generation.
          {
            return true;
          }
    } else if (nStat === 3){
      /*
        Rule 4.: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      */
      return true;
    } else {
      return false;
    }
  }

  handleStart(){
    this.intervalId = setInterval(this.setNewGeneration.bind(this), 100);
    this.setState({
      isSimulate: true
    });
  }

  handleStop(){
    clearInterval(this.intervalId);
    this.setState({
      isSimulate: false
    })
  }


  render() {
    let controlButton;
    if (!this.state.isSimulate){
      controlButton = <Button label="play" onClick={this.handleStart.bind(this)}/>
    } else {
      controlButton = <Button label="pause" onClick={this.handleStop.bind(this)}/>
    }
    return (
      <div className="App">
        <h1>Game Of Life</h1>

        <Button label="50x30" onClick={this.handleSetTableSize.bind(this)}/>
        <Button label="70x50" onClick={this.handleSetTableSize.bind(this)}/>
        <Button label="100x80" onClick={this.handleSetTableSize.bind(this)}/>

        {controlButton}

        <p>Generation: {this.state.generation}</p>
        <Table table={this.state.table}/>
      </div>
    );
  }
}

export default App;
