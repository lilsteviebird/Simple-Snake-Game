import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';

import { Grid, Cell, Button, List, ListItem, ListItemContent } from 'react-mdl';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      begin: false,
      food: getRandomCoordinates(),
      speed: 50,
      direction: 'RIGHT',
      snakeDots: [
        [0,0],
        [2,0]
      ],
      tries: [],
      tryNumber: 0
    };
  }

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.checkIfOutOfBorders();
    this.checkIfCollapsed();
    this.checkIfEat();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  moveSnake = () => {
    if(this.state.begin){
      let dots = [...this.state.snakeDots];
      let head = dots[dots.length - 1];
  
      switch (this.state.direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
      }
      dots.push(head);
      dots.shift();
      this.setState({
        snakeDots: dots
      })
    }
  }

  checkIfOutOfBorders() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  checkIfCollapsed() {
    let snake = [...this.state.snakeDots];
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();
      }
    })
  }

  checkIfEat() {
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates()
      })
      this.enlargeSnake();
      this.increaseSpeed();
    }
  }

  enlargeSnake() {
    let newSnake = [...this.state.snakeDots];
    newSnake.unshift([])
    this.setState({
      snakeDots: newSnake
    })
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10
      })
    }
  }

  onGameOver() {
    let temp = this.state.snakeDots.length;
    this.setState({
      begin: false,
      food: getRandomCoordinates(),
      speed: 50,
      direction: 'RIGHT',
      snakeDots: [
        [0,0],
        [2,0]
      ],
      tries: this.state.tries.concat(temp),
      tryNumber: this.state.tryNumber + 1
    })
  }

  toggleStart = () =>{
    this.setState({
      begin: true
    })
  }



  render() {
    return (
      <div className = 'game-body'>
        <Grid>
          <Cell col={4}>
            <h1>List of Tries</h1>
            <List>
            {this.state.tries.map((val, index) => (
              <ListItem>
                <ListItemContent avatar="person">
                  Try Number {index + 1} || Score: {val}
                </ListItemContent>
              </ListItem>
          ))}
            </List>
          </Cell>
          <Cell>
            <Button style={{width: "500px"}} onClick = {this.toggleStart} raised accent>CLICK TO BEGIN</Button>
            <div className = 'game-area'>
              <Snake snakeDots={this.state.snakeDots}/>
              <Food dot={this.state.food}/>
            </div>
          </Cell>
        </Grid>
      </div>

    );
  }
}

export default App;