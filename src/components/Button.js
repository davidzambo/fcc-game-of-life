import React, { Component } from 'react';

class App extends Component {

  handleOnClick(e){
    let size = e.target.textContent;
    return this.props.onClick(size);
  }

  render() {
    return (
      <button onClick={this.handleOnClick.bind(this)}>{this.props.label}</button>
    );
  }
}

export default App;
