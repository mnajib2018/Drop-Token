/*
Author: Muhammad Najib
Title: 98Point6 Drop Token
Date: Wed May 23 2018
Description: Drop Token takes place on a 4x4 grid.
A token is dropped along a column (labeled 0-3) and
said token goes to the lowest unoccupied row of the board.
A player wins when they have 4 tokens next to each other 
either along a row, in a column, or on a diagonal.
If the board is filled, and nobody has won then the game is a draw.
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
  value: string value of the circle to determine background color
*/
function getCircleColor(value){
  'returns color in string form based on value'
  if(value === 'X')
    return 'red';
  if(value === 'O')
      return 'blue';
  return '#fff';
}

/*
  props: properties passed by Game class
*/
function Circle(props) {
  'returns a button element with the required properties.'
  return (
    <button className="circle" onClick={props.onClick} style={{backgroundColor: getCircleColor(props.value)}}/>
  );
}

class Board extends React.Component {
  'Board class represents all properties of 4x4 Board'
  renderCircle(i) {
    'returns a Circle element with the required properties'
    return (
      <Circle
        value={this.props.circles[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div  className="circle2">
        <div className="board-row">
          {this.renderCircle(0)}
          {this.renderCircle(1)}
          {this.renderCircle(2)}
          {this.renderCircle(3)}
        </div>
        <div className="board-row">
          {this.renderCircle(4)}
          {this.renderCircle(5)}
          {this.renderCircle(6)}
          {this.renderCircle(7)}
        </div>
        <div className="board-row">
          {this.renderCircle(8)}
          {this.renderCircle(9)}
          {this.renderCircle(10)}
          {this.renderCircle(11)}
        </div>
        <div className="board-row">
          {this.renderCircle(12)}
          {this.renderCircle(13)}
          {this.renderCircle(14)}
          {this.renderCircle(15)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  'Game class stores all game states and properties of its elements.'
  /*
    allMoves: list of arrays that contain Boards for previous moves,
    stepNumber: integer for the move number,
    xIsNext: bool to check whose turn it is,
    userFirst: true if user opts to go first
  */
  constructor(props) {
    'constructor to initialize state properties'
    super(props);
    this.state = {
      allMoves: [{
        circles: Array(16).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      userFirst: false,
    };
  }

   /*
    circles: list of 16 circles with their values
    i: int value of the index of the circle in the list
  */
  isValidCircle(circles, i){
    'returns true if a valid circle is clicked on'
    /*if circle in last row*/
    if(i > 11)
      return true;
    /*check if the circle below is filled*/
    if(circles[i+4])
      return true;
    return false;
  }

  handleClick(i) {
    const allMoves = this.state.allMoves.slice(0, this.state.stepNumber + 1);
    const current = allMoves[allMoves.length - 1];
    const circles = current.circles.slice();
    /*check if the click should be ignored*/
    if (getWinner(circles) || circles[i] || !this.isValidCircle(circles, i) || this.state.xIsNext) {
      return;
    }
    circles[i] = this.state.xIsNext ? 'X' : 'O';
    /*set state to new values*/
    this.setState({
      allMoves: allMoves.concat([{
        circles: circles
      }]),
      stepNumber: allMoves.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  /*
    step: int value to go back to the move number
  */
  jumpTo(step){
    'adjust stepNumber and other variables to go back in allMoves.'
    this.setState({
      stepNumber: step,
    });
    /*if first move assign turn to X*/
    if(step === 0){
      this.setState({
        xIsNext: true,
      });
      return;
    }
    /*select xIsNext variable according to which player went first.*/
    if(this.state.userFirst){
      this.setState({
        xIsNext: (step % 2) === 1,
      });
    } else {
      this.setState({
        xIsNext: (step % 2) === 0,
      });
    }
  }

  assignUserPlayer(){
    'assigns first turn to user player.'
    this.setState({
      xIsNext: false,
      userFirst: true,
    });
  }

  getRandomInt(min, max) {
    'get a random integer for picking a column for X move'
    return Math.floor(Math.random() * (max - min)) + min;
  }

  makeXMove(){
    'returns the game state with the new X move added'
    const allMoves = this.state.allMoves.slice(0, this.state.stepNumber + 1);
    const current = allMoves[allMoves.length - 1];
    const circles = current.circles.slice();
    /*return null if winner decided or board is full*/
    if (getWinner(circles) || isBoardFull(circles)) {
      return;
    }
    /*next_col is the column to filled with new X*/
    let next_col;
    next_col = this.getRandomInt(0,4);
    while(isColFull(circles,next_col)){
        next_col = (next_col+1)%4;
    }
    /*new_circles to be added to the list of moves */
    const new_circles = circles.slice();
    /*for the randomly picked column fill the lowest row*/
    for(var i = 0; i <= 12; i=i+4){
      /*start checking from the bottom of the column*/
      var j = 12-i;
      if(!circles[j+next_col]){
        new_circles[j+next_col] = 'X';
        break;
      }
    }
    /*change the game state by adding the Xmove etc.*/
    this.setState({
      allMoves: allMoves.concat([{
        circles: new_circles
      }]),
      stepNumber: allMoves.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const allMoves = this.state.allMoves;
    const current = allMoves[this.state.stepNumber];
    const winner = getWinner(current.circles);
    const board_full = isBoardFull(current.circles);
    /*Assign user the first player*/
    const first_move = <button class="btn" onClick={() => this.assignUserPlayer()}>Take First Move</button>
    /*to be displayed for user to click on X Move. onClick leads to X Move shown on board*/
    const getComputerMove = <button className="btn" onClick={() => this.makeXMove()}>Make X Move</button>;
    const game_over = false;
    const game_start = <div></div>
    /*to go back to a previous move. Game start in this case.*/
    const moves = allMoves.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <div key={move}>
          {move === 0 && <button className="btn" onClick={() => this.jumpTo(move)}>{desc}</button>}
        </div>
      );
    });
    let status;
    if (winner) {
      this.game_over = true;
      status = 'Result:  Winner: ' + winner;
    } else if (board_full) {
      this.game_over = true;
      status = 'Result:  Game Drawn';
    } else {
      this.game_over = false;
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <div>
            <Board
              circles={current.circles}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
        </div>
        <div className="game-info">
        <div>
          <div id="banner">
            <div id="banner-content">
              98point6 Drop Token
            </div>
          </div>
            <div className="symbol">Symbols <ol><li>X: Computer</li><li> O: User</li></ol></div>
            <div className="status">{status}</div>
            {this.state.stepNumber === 0 && <div>{first_move}</div>}
            {this.state.xIsNext && <div>{getComputerMove}</div>}
            <div>{this.game_over && moves}</div>
        </div>
        </div>
      </div>
    );
  }
}

/*
  circles: list - current state of the board
  col: int - column number of the board
*/
function isColFull(circles, col){
  'returns true if a particular column is full.'
  if(circles[col])
    return true;
  return false;
}

/*
  circles: list - current state of the board
*/
function isBoardFull(circles){
  'return true if the board is full.'
  return circles[0] && circles[1] && circles[2] && circles[3];
}

/*
  circles: list - current state of the board
*/
function getWinner(circles) {
  'return the symbol of the winner if determined'
  /*lines represent all winning combinations for comparison*/
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];
  /*if same symbol for any combination in lines, return the winner else null.*/
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (circles[a] && circles[a] === circles[b] && circles[a] === circles[c] && circles[a] === circles[d]) {
      return circles[a];
    }
  }
  return null;
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
