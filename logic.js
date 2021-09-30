const preGameModal = (() => {
    const modal = document.querySelector('.pre-game-modal');
    const board = document.querySelector('main');
    const selectPlayer = document.querySelector('.player2');
    const selectBot = document.querySelector('.computer');
    const selectReturn = document.querySelectorAll('.return');
    const choosingDiv = document.querySelector('.choosing');
    const startGameBtn = document.querySelector('.start-btn');
    const playerOneInput = document.querySelector(`input[data-player='1']`);
    const playerTwoInput = document.querySelector(`input[data-player='2']`);
    let choosePlayer;
    let computerDifficulty;
    let haveSelected = false;
    const playerSelected = {}

    const _toggleClose = () => {
        choosingDiv.classList.toggle('close');
    }

    const _toggleReturn = () => {
        choosingDiv.classList.toggle('close');
    }

    const _toggleOpen = (selection) => {
        const choosenDiv = document.querySelector(`.${selection}`);
        choosenDiv.classList.toggle('open');    
    }

    selectPlayer.addEventListener('click', () => {
        _toggleClose();
        _toggleOpen('player2-choosen');
        haveSelected = true;
        choosePlayer = true;
    });

    selectBot.addEventListener('click', () => {
        _toggleClose();
        _toggleOpen('computer-choosen');
        haveSelected = true;
    });

    selectReturn.forEach((elem) => {
        elem.addEventListener('click', (e) => {
            _toggleOpen(e.target.getAttribute('data-return'));
            _toggleClose();

            if (e.target.getAttribute('data-return') === 'player2-choosen') {
                choosePlayer = false;
            } ;
        })
    })

    startGameBtn.addEventListener('click', (e) => {
        if (!haveSelected) {
            alert('Choose an Opponent!');
            return;
        }

        playerOne = player(playerOneInput.value);
        playerSelected['playerOne'] = playerOne;

        if (choosePlayer) {
            console.log('PlayerChoosen');
            playerTwo = player(playerTwoInput.value, display=2);
            playerSelected['playerTwo'] = playerTwo;
        } else {
            console.log('ComputerChoosen');
            computerDifficulty = document.querySelector('input[name="difficulty"]:checked').id;
            console.log(computerDifficulty);
            computer = computerAi(difficulty=computerDifficulty);
            playerSelected['computer'] = computer;
        }
        
        modal.style.display = 'none';
        board.style.display = 'block';
    })
    return {playerSelected};
})();

const player = ((name, display=1) => {
    return {
        name,
        display
    };
})

const computerAi = ((difficulty, name='computer', display=2) => {
    computerMove = () => {
        if (difficulty === 'easy') {
            return _easyMove();
        } else {
            return _mediumMove();
        }
    }

    _randomNum = (max = 3) => {
        return Math.floor(Math.random() * max)
    }

    _easyMove = () => {
        let first = _randomNum();
        let second= _randomNum();
        while (!_checkValidMove(first, second)) {
            first = _randomNum();
            second= _randomNum();
        }
        console.log(`${first}-${second}`)
        return `${first}-${second}`;
    }

    _checkValidMove = (first, second) => {
        if (gameBoard.getBoard()[first][second] === 0) {
            return true;
        } else {
            return false;
        }
    }

    _mediumMove = () => {
        let playerCanWin = false
        let tempBoard = gameBoard.getBoard().slice()
        for (let i = 0; i<=2; i++) {
            for (let j = 0; j<=2; j++) {
                if (gameBoard.getBoard()[i][j] === 0) {
                    tempBoard[i][j] = 2;
                    playerCanWin = checkVictory.hasVictory(tempBoard);
                    tempBoard[i][j] = 0;

                    if (playerCanWin) {return `${i}-${j}`}
                }
            }
        }

        return _easyMove();
    }
    return {
        name,
        display,
        difficulty,
        computerMove
    }
})

const gameBoard = (() => {
    const _board = [[0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]]

    const getBoard = () => _board

    const updateBoard = (gridNum, player) => {
        const rowNum = gridNum.substr(0,1);
        const colNum = gridNum.substr(-1);
        _board[rowNum][colNum] = player.display;
        return checkVictory.hasVictory(_board);
    }
    return {
        getBoard,
        updateBoard
    }

})();

const game = (() => {
    const grids = document.querySelectorAll('.grid-child');
    let displayClass = 'choosenX';
    let gameRound = 1;
    let gridSelected;
    let currentPlayer;
    let isComputer;
    let result;
    let hasEnded = false;

    const _getCurrentPlayer = () => {
        isComputer = preGameModal.playerSelected.playerTwo ? false : true;
        if (gameRound % 2 === 1) {
            currentPlayer = preGameModal.playerSelected.playerOne;
            //console.log(currentPlayer);
        } else if (isComputer === false && gameRound % 2 === 0) {
            currentPlayer = preGameModal.playerSelected.playerTwo;
            //console.log(currentPlayer);
        } else {
            currentPlayer = preGameModal.playerSelected.computer;
            //console.log(currentPlayer);
        }

        return currentPlayer;
    }
    const _nextRound = () => {
        gameRound++;
    }
    const _switchTurn = () => {
        _nextRound();
        if (gameRound % 2 === 1) {
            displayClass = 'choosenX';
        } else {
            displayClass = 'choosenO';
        }
    }

    const _endGame = (result, currentPlayer) => {
        let endGameMessage;
        if (result === true) {
            endGameMessage = 'Won';
            _addEndGameMessage(endGameMessage, currentPlayer.name);
            hasEnded = true;
        } else if (result === 'draw') {
            endGameMessage = 'Draw';
            _addEndGameMessage(endGameMessage, currentPlayer.name);
            hasEnded = true;
        } else {
            return;
        }
    }

    const _addEndGameMessage = (message, who) => {
        const endModal = document.querySelector('.end-modal');
        const htmlWho = document.querySelector('.end-modal h3');
        const htmlMessage = document.querySelector('.end-modal p');
        const restartBtn = document.querySelector('.end-modal .restart');
        const backdrop = document.querySelector('.backdrop-modal');
        
        backdrop.style.display = 'block';
        endModal.style.display = 'block';
        htmlWho.textContent = who;
        if (message === 'Draw') {
            htmlWho.textContent = 'Both';
            htmlMessage.textContent = message;
        }

        restartBtn.addEventListener('click', (e) => {
            window.location.reload();
        })
    }

    grids.forEach( elem => {
        elem.addEventListener('click', e => {
            if (e.target.classList[1] === 'choosenO') return; // Prevent Clicking on grid that computer has placed

            _getCurrentPlayer(); // Based on game round determined the current turn of player
            e.target.classList.toggle(displayClass);
            gridSelected = (e.target.getAttribute('data-grid'));
            result = gameBoard.updateBoard(gridSelected, currentPlayer); // Update board with the choosen grid
            _endGame(result, currentPlayer); // Check whether has a winner been determined and pop up the end modal
            _switchTurn();
            console.log('Hello',hasEnded);

            if (isComputer && hasEnded === false) { //hasEnded to prevent computer from making a move after playerOne wins
                _getCurrentPlayer(); // Based on game round determined the current turn of player
                gridSelected = currentPlayer.computerMove()
                let computerDisplay = document.querySelector(`[data-grid='${gridSelected}']`);
                computerDisplay.classList.toggle(displayClass);
                result = gameBoard.updateBoard(gridSelected, currentPlayer); // Update board with the choosen grid
                console.log(gameBoard.getBoard());
                _endGame(result, currentPlayer); // Check whether has a winner been determined and pop up the end modal
                _switchTurn();
            }
        }, {once: true}); // Prevent Clicking on grid the player him/herself has clicked on
    });

    return {
        gridSelected,
        _getCurrentPlayer
    }
})()


const checkVictory = (() => {
    let gameRound = 0;
    let win = false;
    const _checkPlayerTurnVictory = () => {
        const turn = game._getCurrentPlayer()
        return turn.display
    }

    const _checkVertical = (board) => {
        const num = _checkPlayerTurnVictory();
        for (let i = 0; i<=2; i++) {
            if (board[0][i] === num && board[1][i] === num && board[2][i] === num) {
                return true;
            } 
        }
        return false;
    }

    const _checkHorizontal = (board) => {
        const num = _checkPlayerTurnVictory();
        for (let i = 0; i<=2; i++) {
            if (board[i][0] === num && board[i][1] === num && board[i][2] === num) {
                return true;
            }
        }
    }

    const _checkTopToRightdiagonal = (board) => {
        const num = _checkPlayerTurnVictory();
        if (board[0][0] === num && board[1][1] === num && board[2][2] === num) {
            return true;
        } 
    }

    const _checkBtmToRightdiagonal = (board) => {
        const num = _checkPlayerTurnVictory();
        if (board[2][0] === num && board[1][1] === num && board[0][2] === num) {
            return true;
        } 
        
    }

    const hasVictory = (board) => {
        if (_checkVertical(board) || _checkHorizontal(board) || _checkTopToRightdiagonal(board) || _checkBtmToRightdiagonal(board)) {
            win = true;
        }
        gameRound++;
        console.log(gameRound);
        if (gameRound === 9 && win === false) {
            return 'draw'
        }
        return win;      
    }

    return {
        hasVictory
    }
})()
