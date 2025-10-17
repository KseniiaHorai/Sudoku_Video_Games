import { Sudoku } from "./sudoku.js";
import { turnIndexIntoPosition, turnPositionIntoIndex,  SIZE, TILE_NUMBER, SQUARE_NUMBER } from "./utilities.js";

let sudoku;
let inputTile;
let selectedTile;
let selectedBoardTile;
let tileNumber;
let timerStarted;

generateBoard();
timerStarted = startTimer();

//Choose difficulty and create a board dynamically
const difficultyBtns = document.querySelectorAll('.menu_item');
difficultyBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    generateBoard(index);
    console.log(sudoku.solution);
    clearInterval(timerStarted);
    timerStarted = startTimer(index);
  });
});

function generateBoard(index = 0) {
  sudoku = new Sudoku(index);
  selectedBoardTile = null;
  tileNumber = null;
  clearElements('.board_tiles');
  clearElements('.endGame');
  createBoard();
  clearElements('.heart');
  createHearts();
  fillBoard(sudoku.grid);
  selectBoardTile(sudoku.grid);
}

function clearElements(className) {
  const elements = document.querySelectorAll(className);
  if (elements) {
    elements.forEach((item) => {
      item.remove();
    });
  }
}

function createBoard() {
  const boardRowsTiles = document.querySelectorAll('.board_rows_tiles');
  let row = 0;
  for (let i = 0; i < SIZE; i++) {
    if (i % SQUARE_NUMBER == 0 && i != 0) {
      row++;
    }
    const tile = document.createElement('div');
    tile.classList.add('board_tiles');
    boardRowsTiles[row].append(tile);
  }
}

function createHearts() {
  const lives = document.querySelector('.lives');
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('img');
    heart.src = 'img/heart.png';
    heart.classList.add('heart');
    lives.append(heart);
  }
}

function fillBoard(board) {
  const boardTiles = document.querySelectorAll('.board_tiles');
  boardTiles.forEach((tile, index) => {
    const { row, column } = turnIndexIntoPosition(index);
    if (board[row][column]) {
      tile.textContent = board[row][column];
    } else {
      tile.textContent = '.';
    }
  });
}

function startTimer(difficulty = 0) {
  let time;
  if (difficulty == 0 || difficulty == 1) {
    time = 180;
  } else if (difficulty == 2 || difficulty == 3) {
    time = 300;
  } else if (difficulty == 4) {
    time = 360;
  }

  const mainTimer = document.querySelector('.timer'),
    minutesTimer = mainTimer.querySelector('#minutes'),
    secondsTimer = mainTimer.querySelector('#seconds');

  const timer = setInterval(updateClock, 1000);

  function getZero(num) {
    if (num >= 0 && num < 10) {
      num = `0${num}`;
    }
    return num;
  }

  function updateClock() {
    time--;
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    minutesTimer.innerHTML = getZero(minutes);
    secondsTimer.innerHTML = getZero(seconds);
    if (time <= 0) {
      endGame(false);
    }
  }
  return timer;
}

//Input buttons
const inputButtons = document.querySelectorAll('.input_digit');

inputButtons.forEach((inputBtn, index) => {
  inputBtn.addEventListener('click', () => {
    if (inputBtn.classList.contains('selected')) {
      inputBtn.classList.remove('selected');
      selectedTile = null;
    } else {
      inputButtons.forEach((btn) => {
        btn.classList.remove('selected');
      });

      inputBtn.classList.add('selected');
      selectedTile = index + 1;
      inputTile = inputBtn;
    }
    updateMove();
  });
});

//Board tiles
function selectBoardTile(board) {
  const boardTiles = document.querySelectorAll('.board_tiles');
  boardTiles.forEach((tile, index) => {
    const { row, column } = turnIndexIntoPosition(index);
    if (!board[row][column]) {
      tile.addEventListener('click', () => {
        onTileClick(tile, index, boardTiles);
      });
    }
  });
}

function onTileClick(tile, index, boardTiles) {
  if (tile.classList.contains('selected_board_tile')) {
    for (let i = 0; i < boardTiles.length; i++) {
      boardTiles[i].classList.remove('selected_board_tile', 'highlighted', 'shake', 'error');
    }
    selectedBoardTile = null;
  } else {
    for (let i = 0; i < boardTiles.length; i++) {
      boardTiles[i].classList.remove('selected_board_tile', 'highlighted', 'shake', 'error');
    }
    tile.classList.add('selected_board_tile');
    selectedBoardTile = tile;
    tileNumber = index;
    highlightByCell(index, boardTiles);
    updateMove();
  }
}

function highlightByCell(index, boardTiles) {
  highlightByRowAndColumn(index, boardTiles);
  highlightBox(index, boardTiles);
}

function highlightByRowAndColumn(index, boardTiles) {
  const { row, column } = turnIndexIntoPosition(index);

  for (let i = 0; i < TILE_NUMBER; i++) {
    const cellIndexRow = row * TILE_NUMBER + i;
    boardTiles[cellIndexRow].classList.add('highlighted');
    const cellIndexColumn = i * TILE_NUMBER + column;
    boardTiles[cellIndexColumn].classList.add('highlighted');
  }
}

function highlightBox(index, boardTiles) {
  const { row, column } = turnIndexIntoPosition(index);
  let newRowStart = Math.floor(row / SQUARE_NUMBER) * SQUARE_NUMBER;
  const newRowEnd = newRowStart + SQUARE_NUMBER;
  let newColumnStart = Math.floor(column / SQUARE_NUMBER) * SQUARE_NUMBER;
  const newColumnEnd = newColumnStart + SQUARE_NUMBER;

  for (newRowStart; newRowStart < newRowEnd; newRowStart++) {
    for (let i = newColumnStart; i < newColumnEnd; i++) {
      const index =turnPositionIntoIndex(newRowStart, i);
      boardTiles[index].classList.add('highlighted');
    }
  }
}

function updateMove() {
  const boardTiles = document.querySelectorAll('.board_tiles');
  if (selectedTile && selectedBoardTile) {
    fillWithCorrectNumbers(boardTiles, selectedTile);
  }
}

function fillWithCorrectNumbers(boardTiles, number) {
  selectedBoardTile.textContent = number;
  if (checkCorrect(tileNumber, number)) {
    makeCorrect(boardTiles);
    if (checkWon()) {
      endGame(true);
    }
    const { row, column } = turnIndexIntoPosition(tileNumber);
    sudoku.grid[row][column] = number;
  } else {
    makeIncorrect(boardTiles, number);
  }
  inputTile.classList.remove('selected');
  selectedTile = null;
}

function makeCorrect(boardTiles) {
  selectedBoardTile.classList.remove('selected_board_tile');
  for (let i = 0; i < boardTiles.length; i++) {
    boardTiles[i].classList.remove('highlighted');
  }
  selectedBoardTile = null;
}

function makeIncorrect(boardTiles, number) {
  selectedBoardTile.classList.add('incorrect');
  getDuplicates(number, boardTiles);
  setTimeout(() => {
    console.log(selectedBoardTile);
    selectedBoardTile.classList.remove('incorrect', 'selected_board_tile');
    selectedBoardTile.textContent = '.';
    for (let i = 0; i < boardTiles.length; i++) {
      boardTiles[i].classList.remove('highlighted');
    }
    selectedBoardTile = null;
    removeHeart();
  }, 300);
}

function getDuplicates(number, boardTiles) {
  const { row, column } = turnIndexIntoPosition(tileNumber);
  const duplicates = sudoku.getSameNumbers(row, column, number);
  if (duplicates.length) {
    highlightDuplicates(duplicates, boardTiles);
  }
}

function highlightDuplicates(duplicates, boardTiles) {
  duplicates.forEach((duplicate) => {
    const index = turnPositionIntoIndex(duplicate.row, duplicate.column);
    setTimeout(() => { boardTiles[index].classList.add('error', 'shake'), 0; });
  });
}

function checkCorrect(tileNumber, selectedTile) {
  const { row, column } = turnIndexIntoPosition(tileNumber);
  if (sudoku.solution[row][column] == selectedTile) {
    return true;
  } else {
    return false;
  }
}

function removeHeart() {
  const hearts = document.querySelectorAll('.heart');
  hearts[hearts.length - 1].remove();
  const newHearts = document.querySelectorAll('.heart');
  if (newHearts.length == 0) endGame(false);
}

function endGame(status) {
  clearInterval(timerStarted);
  const lives = document.querySelector('.lives');
  clearElements('.board_tiles');
  clearElements('.heart');
  const endGame = document.createElement('img');
  if (status) {
    endGame.src = 'img/win.png';
  } else {
    endGame.src = 'img/game_over.png';
  }
  endGame.classList.add('endGame');
  lives.after(endGame);
}

function checkWon() {
  const tiles = document.querySelectorAll('.board_tiles');
  let counter = 0;
  tiles.forEach((tile) => {
    if (tile.textContent == '.') {
      counter++;
    }
  });

  if (counter == 0 && tiles.length) {
    return true;
  } else {
    return false;
  }
}

//Email
const emailBtn = document.querySelector('[data-email]');
emailBtn.addEventListener('click', () => {
  emailBtn.classList.toggle('email');
  if (emailBtn.classList.contains('email')) {
    emailBtn.textContent = 'horaiksenia@gmai.com';
  } else {
    emailBtn.textContent = 'Send email';
  }
});

//Modal
const modalBtn = document.querySelector('[data-modal]'),
      modalClose = document.querySelector('[data-close]'),
      modal = document.querySelector('.modal');

modalBtn.addEventListener('click', openModal);

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

function openModal() {
  modal.classList.toggle('show');
  if (document.body.style.overflow == 'hidden') {
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }
  clearInterval(modalTimer);
}

function closeModal() {
  modal.classList.toggle('show');
  document.body.style.overflow = '';
}

const modalTimer = setTimeout(openModal, 5000);
