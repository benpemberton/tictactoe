const Player = (name) => {
  let points = 0;
  return {name, points}
}

const game = (() => {
  let player = 'X';
  const playerTurn = () => {
    return player;
  }
  const changePlayer = (e) => {
    if (e.currentTarget.classList.contains('player')) {
      player = e.currentTarget.textContent;
    } else {
      player === 'X'? player = 'O': player = 'X';
    }
  }
  return {playerTurn, changePlayer};
})();

const gameBoard = (() => {
  const tictacs = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'O'];
  const placeMarker = (e) => {
    if (e.target.innerHTML === '') {
      e.target.innerHTML = game.playerTurn();
    }
  }
  return {tictacs, placeMarker};
})();

const cells = document.querySelectorAll('.grid-cell');
cells.forEach(cell => {
  cell.addEventListener('click', gameBoard.placeMarker);
});

const playerBtns = document.querySelectorAll('.player');
playerBtns.forEach(btn => {
  btn.addEventListener('click', game.changePlayer);
});
