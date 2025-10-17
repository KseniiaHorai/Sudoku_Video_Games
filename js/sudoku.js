import { generateSudoku, solveSudoku } from './generateSudoku.js';

export class Sudoku {
  constructor(level = 0) {
    this.grid = JSON.parse(JSON.stringify(generateSudoku(level)));
    this.solution = solveSudoku(this.grid);
  }

  getSameNumbers(row, column, value) {
    const sameInRowAndColumn = this.getSameNumbersInRow(row, column, value);
    const sameInBox = this.getSameNumbersInBox(row, column, value);
    const duplicates = [...sameInRowAndColumn, ...sameInBox];

    sameInBox.forEach((tile) => {
      if (tile.row != row && tile.column != column) {
        duplicates.push(tile);
      }
    });
    return duplicates;
  }

  getSameNumbersInRow(row, column, value) {
    const duplicates = [];
    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] == value) {
        duplicates.push({ row, column: i });
      }
      if (this.grid[i][column] == value) {
        duplicates.push({ row: i, column });
      }
    }
    return duplicates;
  }

  getSameNumbersInBox(row, column, value) {
    const duplicates = [];
    let newRowStart = Math.floor(row / 3) * 3;
    const newRowEnd = newRowStart + 3;
    let newColumnStart = Math.floor(column / 3) * 3;
    const newColumnEnd = newColumnStart + 3;

    for (newRowStart; newRowStart < newRowEnd; newRowStart++) {
      for (let a = newColumnStart; a < newColumnEnd; a++) {
        if (this.grid[newRowStart][a] == value) {
          duplicates.push({ row: newRowStart, column: a });
        }
      }
    }
    return duplicates;
  }

  findEmptyCells() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (this.grid[row][column] === null) return true;
      }
    }
    return false;
  }
}
