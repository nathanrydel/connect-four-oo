"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
  constructor(p1, p2, height = 6, width = 7, board = []) {
    // keep track of both players
    this.players = [p1, p2];
    this.width = width;
    this.height = height;
    this.board = board;
    this.currPlayer = p1;
    this.gameOver = false;
    this.start();
  }

  /** makeBoard: fill in global `board`:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({ length: this.width }).fill(null);
      this.board.push(emptyRow);
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.getElementById("board");
    htmlBoard.innerHTML = "";

    // Creates individual column blocks in the top row
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      headCell.addEventListener("click", this.handleClick.bind(this));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
 *    (return null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  // TODO: update the function to set the correct player color
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    setTimeout(() => {
      alert(msg);
    }, 100);
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    };

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          this.gameOver = true;
          return true;
        }
      }
    }
    return false;
  }


  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // if game is over, ignore additional moves
    // TODO: Single line capable
    if (this.gameOver === true) {
      return;
    }

    // get x from ID of clicked cell
    const x = Number(evt.target.id.slice("top-".length));
    console.log("evt.target.id in handleClick", evt.target.id);
    console.log("x in handleClick", x);
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    // TODO: single line capable
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    // TODO: nothing displays on winning condition
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie: if top row is filled, board is filled
    if (this.board[0].every(cell => cell !== null)) {
      return this.endGame('Tie!');
    }

    // switch players
    // TODO: game no longer switches players after passing in individual players
    // to constructor function
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

  /** Start game. */

  start() {
    this.makeBoard();
    this.makeHtmlBoard();
  }
}

/**
 * Create a player class to store the color from the start menu form
 */

class Player {
  constructor(color) {
    this.color = color;
  }
}


document.getElementById("start-menu").addEventListener("submit", function (event) {
  // prevent the default form behavior
  event.preventDefault();

  // get the values from the input fields
  const p1InputColor = document.getElementById('p1').value;
  const p2InputColor = document.getElementById('p2').value;

  // create new Player objects with the p*InputColor
  const p1 = new Player(p1InputColor);
  const p2 = new Player(p2InputColor);
  new Game(p1, p2);
});
