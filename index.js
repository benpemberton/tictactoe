const Player = (name) => {
  let points = 0;
  return {name, points}
}

const game = (() => {
  const playerBtns = document.querySelectorAll('.player');

  let player = undefined;
  let player1;
  let player2;

  const playerTurn = () => {
    return player;
  }

  const choosePlayer = (e) => {
    player = e.target.textContent;
    playerBtns.forEach(btn => {
      btn.removeEventListener('click', game.choosePlayer);
    });
    player1 = Player(getPlayerName('X'));
    player2 = Player(getPlayerName('O'));
    toggleCurrentPlayer(e);
    disableInputs();
    displayScores();
    gameBoard.activateBoard();
    gameBoard.closeModal();
    const nextRoundBtn = document.querySelector('#next-btn');
    nextRoundBtn.style.display = 'inline-block';
  }

  const getPlayerName = (marker) => {
    let name;
    const input = document.querySelector(`#${marker}-name`);
    input.value === ''? name = marker: name = input.value;
    return name;
  }

  const changePlayer = (e) => {
    player === 'X'? player = 'O': player = 'X';
  }

  const toggleCurrentPlayer = (e) => {
    if (e) {
      const btn = document.querySelector(`#${player}-btn`);
      btn.classList.toggle('current');
    } else {
      const btns = document.querySelectorAll('.player');
      btns.forEach(btn => {
        btn.classList.toggle('current');
      });
    }
  }

  const checkForWinner = () => {
    let winner = ['','',''];
    let winningCombos;
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
        winningCombos? winningCombos = winningCombos.concat(combos[prop]): winningCombos = combos[prop];
        winner = ['','',''];
      } else {
        winner = ['','',''];
      }
    }

    if (winningCombos) {
      declareWinner(winningCombos);
    } else if (gameBoard.tictacs.filter(Boolean).length === 9) {
      declareDraw();
    } else {
      changePlayer();
      toggleCurrentPlayer();
    }
  }

  const declareWinner = (combo) => {
    combo.forEach(index => {
      const div = document.querySelector(`div[data-index="${index}"]`);
      div.querySelector('path').classList.add('highlight');
    });
    const highlightedDiv = document.querySelector('.highlight');
    highlightedDiv.onanimationend = () => {
      gameBoard.openModal();
      const text = document.getElementById('modal').querySelector('span');
      if (player === 'X') {
        text.innerHTML = `${player1.name} wins!`;
        player1.points += 1;
      } else {
      text.innerHTML = `${player2.name} wins!`;
      player2.points += 1;
      }
      displayScores();
      const nextRoundBtn = document.querySelector('#next-btn');
      nextRoundBtn.addEventListener('click', nextRound.bind(declareWinner),{once:true});
    }
  }

  const declareDraw = () => {
    gameBoard.openModal();
    const text = document.getElementById('modal').querySelector('span');
    text.innerHTML = 'It\'s a draw';
    const nextRoundBtn = document.querySelector('#next-btn');
    nextRoundBtn.addEventListener('click', nextRound.bind(declareDraw),{once:true});
  }

  function nextRound() {
    if (this === declareWinner) {
      gameBoard.resetBoard();
      gameBoard.closeModal();
    } else if (this === declareDraw) {
      changePlayer();
      toggleCurrentPlayer();
      gameBoard.resetBoard();
      gameBoard.closeModal();
    }
  }

  const introText = () => {
    const nextRoundBtn = document.querySelector('#next-btn');
    nextRoundBtn.style.display = 'none';
    const text = document.getElementById('modal').querySelector('span');
    text.innerHTML = 'Enter player names and then pick a marker to start';
    gameBoard.openModal();
  }

  const resetGame = () => {
    player = undefined;
    player1 = undefined;
    player2 = undefined;
    gameBoard.resetBoard();
    resetInputs();
    removeScores();
    resetPlayerBtns();
    gameBoard.deactivateBoard();
    const modal = document.getElementById('modal');
    if (modal.style.display === 'flex') {
      gameBoard.closeModal();
    }
    playerBtns.forEach(btn => {
      btn.addEventListener('click', game.choosePlayer);
    });
    introText();
  }

  const disableInputs = () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('readonly', 'readonly');
    });
  }

  const resetInputs = () => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.removeAttribute('readonly');
      input.value = '';
    });
  }

  const resetPlayerBtns = () => {
    const btns = document.querySelectorAll('.player');
    btns.forEach(btn => {
      btn.classList.remove('current');
    });
  }

  const displayScores = () => {
    const scoreDivs = document.querySelectorAll('.player-scores');
    scoreDivs.forEach(div => {
      if (div.id === 'player1-score') {
        div.querySelector('span').innerHTML = player1.points;
      } else {
        div.querySelector('span').innerHTML = player2.points;
      }
    });
  }

  const removeScores = () => {
    const scoreDivs = document.querySelectorAll('.player-scores');
    scoreDivs.forEach(div => {
      div.querySelector('span').innerHTML = '';
    });
  }

  return {playerTurn, choosePlayer, changePlayer, checkForWinner, toggleCurrentPlayer, resetGame, introText};
})();

const gameBoard = (() => {
  let tictacs = [];
  const cells = document.querySelectorAll('.grid-cell');
  const placeMarker = (e) => {
    const nought = makeSVGElement();
    nought.innerHTML = 
    `<path id="Selection"
      fill="black" stroke="" stroke-width="1"
      d="M 36.00,0.47
      C 41.75,0.17 46.85,1.59 52.00,4.10
      56.18,6.13 64.29,11.18 66.92,14.89
      71.73,21.67 75.27,33.66 74.58,42.00
      74.40,44.15 73.32,46.88 72.65,49.00
      68.27,62.84 57.68,72.84 42.99,74.44
      36.26,75.17 27.36,75.41 21.00,72.86
      -2.63,63.37 -4.92,32.18 9.88,14.26
      12.00,11.70 26.07,3.00 29.00,1.88
      30.94,1.15 33.91,0.78 36.00,0.47 Z
      M 54.82,45.00
      C 55.27,42.18 55.55,40.45 55.45,37.91
      54.82,32.55 54.20,28.09 48.82,23.56
      42.98,18.64 40.63,18.98 34.00,19.45
      31.26,19.65 25.72,20.83 23.51,22.62
      18.63,26.60 17.88,33.16 18.03,38.96
      18.29,48.51 23.90,56.19 34.00,56.64
      41.22,56.96 43.64,55.91 46.64,54.27
      50.00,53.18 54.73,46.00 54.82,45.00 Z" />`;


    const cross = makeSVGElement();
    cross.innerHTML = 
    `<path id="Selection"
      fill="black" stroke="" stroke-width="1"
      d="M 19.12,12.75
      C 24.50,16.62 23.25,15.55 25.83,17.77
      27.31,19.03 32.29,23.50 33.71,24.06
      36.70,25.24 38.75,21.38 40.34,19.42
      44.49,14.33 50.34,7.30 56.00,4.00
      64.16,-0.76 73.46,4.05 70.15,14.00
      68.27,19.63 61.22,25.77 57.00,30.00
      55.27,31.74 50.94,35.61 50.62,38.00
      50.31,40.35 52.55,42.45 54.02,43.99
      58.17,48.30 66.78,55.66 67.75,56.44
      67.75,56.44 69.94,58.38 70.97,60.31
      72.81,62.88 73.00,64.75 73.00,64.75
      73.47,67.19 72.92,69.04 71.51,70.35
      63.33,77.96 51.45,66.50 46.00,61.00
      44.49,59.47 39.74,53.91 37.92,53.62
      35.55,53.25 32.52,57.40 31.13,59.00
      26.74,64.06 17.98,76.75 10.23,71.15
      2.33,65.44 14.88,50.05 18.92,45.00
      20.14,43.47 22.34,41.02 22.47,39.00
      22.64,36.30 19.72,33.77 17.99,32.00
      14.50,28.42 3.81,19.36 2.18,16.00
      -0.48,10.51 3.81,5.93 10.00,7.50
      14.15,8.55 13.75,9.62 19.12,12.75 Z
      M 30.00,61.00 30.00,61.00 30.00,61.00 30.00,61.00
      M 14.00,10.12" />`;


    if (e.target.innerHTML === '') {
      game.playerTurn() === 'X'? e.target.appendChild(cross): e.target.appendChild(nought);
      updateArray(e);
      game.checkForWinner();
    }
  }
  const updateArray = (e) => {
    let index = e.target.dataset.index;
    gameBoard.tictacs[index] = game.playerTurn();
  }
  const activateBoard = () => {
    cells.forEach(cell => {
      cell.addEventListener('click', gameBoard.placeMarker);
    });
  }
  const deactivateBoard = () => {
    cells.forEach(cell => {
      cell.removeEventListener('click', gameBoard.placeMarker);
    });
  }
  const resetBoard = () => {
    gameBoard.tictacs = [];
    cells.forEach(cell => {
      cell.innerHTML = '';
    });
  }
  const openModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
  }
  const closeModal = () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }
  const makeSVGElement = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('marker');
    svg.setAttribute('viewBox', '0, 0, 150, 150')
    return svg;
  }
  return {tictacs, placeMarker, activateBoard, deactivateBoard, resetBoard, openModal, closeModal};
})();

window.onload = () => {
  const playerBtns = document.querySelectorAll('.player');
  playerBtns.forEach(btn => {
    btn.addEventListener('click', game.choosePlayer);
  });

  const resetBtn = document.querySelector('#reset');
  resetBtn.addEventListener('click', game.resetGame);

  game.introText();
}