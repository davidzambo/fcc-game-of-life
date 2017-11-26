import React, { Component } from 'react';
import Button from './components/Button';
import Table from './components/Table';
import Footer from './components/Footer';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      table : {
        height: 20,
        width: 30,
        people: [
          []
        ]
      },
      generation: 0,
      isSimulate: false,
      speed : 200
    }
  }

  componentDidMount(){
    this.setInitialState(30, 20);
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
    let people;
    // generate the table
    for (let i = 0; i < height; i++){
      //generate rows
      let row = [];
      for (let j = 0; j < width; j++){
        people = {
          id: 'r'+i+'-c'+j,
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
          id: 'r'+rid+'-c'+cid,
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
          if (table[x+i][y+j] !== undefined && table[x+i][y+j].isAlive === true && !(i === 0 && j === 0))
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
    let speed = this.state.speed;
    this.intervalId = setInterval(this.setNewGeneration.bind(this), speed);
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

  handleSetSpeed(speed){
    this.setState({
      speed: speed
    }, () => {
      if (this.state.isSimulate === true){
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.setNewGeneration.bind(this), this.state.speed);
      }
    });
  }

  manipulatePeople(what){
    /*
    This method will grab the clicked 'poeple\'s' id number, unwrap the coordinates from it
    change the isAlive status of it, and updates the table.
    */
    let coords = what.split('-');
    let x = coords[0].slice(1);
    let y = coords[1].slice(1);
    let table = this.state.table;
    table.people[x][y].isAlive = !table.people[x][y].isAlive;
    this.setState({
      table: table
    });
  }

  clearTable(){
    // stop auto generation
    clearInterval(this.intervalId);
    let table = this.state.table;
    let population = table.people;
    let newPopulation; // this will be the new table
    let newRow;

    // rid = row index
    // cid = col index
    /*
      Map throug the people array, and set all people dead
    */
    newPopulation = population.map( (oneRow, rid) => {
      newRow = oneRow.map( (ppl, cid) => {

        return ppl = {
          id: 'r'+rid+'-c'+cid,
          isAlive: false
        }
      });
      return newRow;
    });
    table.people = newPopulation;

    this.setState({
      table: table,
      generation: 0,
      isSimulate: false,
      speed: this.state.speed
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
        <header>
          <h1 className="center">Game Of Life</h1>
          <h6 className="center">A mathematical simulation based on the theory of <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer"> John Conway</a></h6>
        </header>

        <Table table={this.state.table} onClick={this.manipulatePeople.bind(this)}/>

        <div className="control-box">
          <div className="control-section">
            <div className="control-title">
              <h4>Control:</h4>
            </div>
            <div className="control-buttons">
              {controlButton}
              <Button label="clear" onClick={this.clearTable.bind(this)}/>
              <button className="generation">Generation: {this.state.generation}</button>
            </div>
          </div>
          <div className="control-section">
            <div className="control-title">
              <h4>Set table size:</h4>
            </div>
            <div className="control-buttons">
              <Button className={this.state.table.height === 20 ? 'generation' : ''} label="30x20" onClick={this.handleSetTableSize.bind(this)}/>
              <Button className={this.state.table.height === 30 ? 'generation' : ''} label="45x30" onClick={this.handleSetTableSize.bind(this)}/>
              <Button className={this.state.table.height === 40 ? 'generation' : ''} label="60x40" onClick={this.handleSetTableSize.bind(this)}/>
            </div>
          </div>
          <div className="control-section">
            <div className="control-title">
              <h4>Set simulation speed: </h4>
            </div>
            <div className="control-buttons">
              <Button className={this.state.speed === 800 ? 'generation' : ''} label="slow" onClick={this.handleSetSpeed.bind(this, 800)}/>
              <Button className={this.state.speed === 400 ? 'generation' : ''} label="normal" onClick={this.handleSetSpeed.bind(this, 400)}/>
              <Button className={this.state.speed === 200 ? 'generation' : ''} label="fast" onClick={this.handleSetSpeed.bind(this, 200)}/>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
