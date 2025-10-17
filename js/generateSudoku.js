'use script';
import { easyBoards, mediumBoards, hardBoards, expertBoards, evilBoards } from './boards.js';
import{ TILE_NUMBER, SQUARE_NUMBER } from './utilities.js';

//Get a grid
export function generateSudoku(level) {
  return getGrid(level);
}

function getGrid(level) {
  const difficulty = chooseDidfficulty(level);
  const randomNumber = Math.floor(Math.random() * 9);
  return difficulty[randomNumber];
}

function chooseDidfficulty(level) {
  let difficulty;
  switch (level) {
    case 0:
      difficulty = easyBoards;
      break;
    case 1:
      difficulty = mediumBoards;
      break;
    case 2:
      difficulty = hardBoards;
      break;
    case 3:
      difficulty = expertBoards;
      break;
    case 4:
      difficulty = evilBoards;
      break;
  }
  return difficulty;
}

//Solve Sudoku
export function solveSudoku(sudoku) {
  const solution = JSON.parse(JSON.stringify(sudoku));
  const counter = countZeroes(sudoku);
  if (counter == 0) {
    return solution;
  }
  for (let i = 0; i < solution.length; i++) {
    for (let j = 0; j < solution.length; j++) {
      if (solution[i][j] == 0) {
        for (let k = 1; k <= TILE_NUMBER; k++) {
          const isUnique = checkUniqueness(solution, i, j, k);
          if (isUnique) {
            solution[i][j] = k;
            const result = solveSudoku(solution);
            if (result) {
              return result;
            }
          }
        }
        solution[i][j] = 0;
        return false;
      }
    }
  }
}

function countZeroes(array) {
  let counter = 0;
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[i][j] == 0) {
        counter++;
      }
    }
  }
  return counter;
}

function checkUniqueness(array, row, column, number) {
  return validateRowsAndColumns(array, row, column, number)
  && validateSquares(array, row, column, number);
}

function validateRowsAndColumns(array, row, column, number) {
  for (let i = 0; i < array.length; i++) {
    if (array[row][i] == number) {
      return false;
    }
    if (array[i][column] == number) {
      return false;
    }
  }
  return true;
}

function validateSquares(array, row, column, number) {
  let newRowStart = Math.floor(row / SQUARE_NUMBER) * SQUARE_NUMBER;
  const newRowEnd = newRowStart + SQUARE_NUMBER;
  let newColumnStart = Math.floor(column / SQUARE_NUMBER) * SQUARE_NUMBER;
  const newColumnEnd = newColumnStart + SQUARE_NUMBER;

  for (newRowStart; newRowStart < newRowEnd; newRowStart++) {
    for (let i = newColumnStart; i < newColumnEnd; i++) {
      if (array[newRowStart][i] == number) {
        return false;
      }
    }
  }
  return true;
}
