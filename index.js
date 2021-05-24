const cells = document.querySelectorAll('.grid-cell');

const playerBtns = document.querySelectorAll('.player');

const Player = (name) => {
  let points = 0;
  return {name, points}
}

const game = (() => {
  let player = undefined;
  const playerTurn = () => {
    return player;
  }
  const choosePlayer = (e) => {
    player = e.target.textContent;
    playerBtns.forEach(btn => {
      btn.removeEventListener('click', game.choosePlayer);
    });
  }
  const changePlayer = () => {
    player === 'X'? player = 'O': player = 'X';
  }
  const checkForWinner = () => {
    let winner = ['','',''];
    const combos = {
      row1: [0, 1, 2],
      row2: [3, 4, 5],
      row3: [6, 7, 8],
      col1: [0, 3, 6],
      col2: [1, 4, 7],
      col3: [2, 5, 8],
      dialeft: [0, 4, 8],
      diaright: [2, 4, 6]
    }
    for (const prop in combos) {
      for (let i = 0; i < combos[prop].length; i++) {
        if (gameBoard.tictacs[combos[prop][i]] === player) {
          winner[i] = true;
        }
      }
      if (winner.filter(Boolean).length === 3) {
        console.log(prop);
        break;
      } else {
        winner = ['','',''];
      }
    }
  }
  return {playerTurn, choosePlayer, changePlayer, checkForWinner};
})();

const gameBoard = (() => {
  let tictacs = [];
  const placeMarker = (e) => {
    if (e.target.innerHTML === '') {
      e.target.innerHTML = game.playerTurn();
      updateArray(e);
      game.checkForWinner();
      game.changePlayer();
    }
  }
  const updateArray = (e) => {
    let index = e.target.dataset.index;
    tictacs[index] = e.target.innerHTML;
  }
  return {tictacs, placeMarker};
})();

cells.forEach(cell => {
  cell.addEventListener('click', gameBoard.placeMarker);
});

playerBtns.forEach(btn => {
  btn.addEventListener('click', game.choosePlayer);
});
