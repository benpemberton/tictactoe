const gameboard = (() => {
  const tictacs = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'O'];
  return {tictacs};
})();

const displayController = (() => {
  const populateBoard = () => {
    let cells = document.querySelectorAll('.grid-cell');
    let i = 0;
    cells.forEach(cell => {
      cell.innerHTML = gameboard.tictacs[i];
      i++;
    });
  }
  return {populateBoard};
})();

displayController.populateBoard()

const Player = (name) => {
  const points = 0;
  return { name, points }
}