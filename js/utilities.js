export const SIZE = 81;
export const TILE_NUMBER = 9;
export const SQUARE_NUMBER = 3;

export function turnIndexIntoPosition(index) {
  const x = Math.floor(index / TILE_NUMBER);
  const y = index % TILE_NUMBER;
  return { row: x, column: y };
}

export function turnPositionIntoIndex(row, column) {
  return row * TILE_NUMBER + column;
}