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
            computer = computerAi(computerDifficulty);
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

const computerAi = ((difficulty, display=2) => {
    return {
        display
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
        console.log(checkVictory.hasVictory(_board));
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

    const _getCurrentPlayer = () => {
        isComputer = preGameModal.playerSelected.playerTwo ? false : true;
        if (gameRound % 2 === 1) {
            currentPlayer = preGameModal.playerSelected.playerOne;
            console.log(currentPlayer);
        } else if (isComputer === false) {
            currentPlayer = preGameModal.playerSelected.playerTwo;
            console.log(currentPlayer);
        } else {
            currentPlayer = preGameModal.playerSelected.computer;
            console.log(currentPlayer);
        }
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

    grids.forEach( elem => {
        elem.addEventListener('click', e => {
            _getCurrentPlayer();

            e.target.classList.toggle(displayClass);
            gridSelected = (e.target.getAttribute('data-grid'));
            gameBoard.updateBoard(gridSelected, currentPlayer);
            _switchTurn();
        }, {once: true});
    });

    const temp = ()=> 'hello'

    return {
        gridSelected,
    }
})()


const checkVictory = (() => {
    const _checkPlayerTurnVictory = () => {
        
    }

    const _checkVertical = (board) => {
        for (let i = 0; i<=2; i++) {
            if (board[0][i] === _checkPlayerTurnVictory() && board[1][i] === _checkPlayerTurnVictory() && board[2][i] === _checkPlayerTurnVictory()) {
                return true;
            } else {
                return false;
            }
        }
    }

    const _checkHorizontal = (board) => {
        for (let i = 0; i<=2; i++) {
            if (board[i][0] === _checkPlayerTurnVictory() && board[i][1] === _checkPlayerTurnVictory() && board[i][2] === _checkPlayerTurnVictory(r)) {
                return true;
            } else {
                return false;
            }
        }
    }

    const _checkTopToRightdiagonal = (board) => {
    
        if (board[0][0] === _checkPlayerTurnVictory() && board[1][1] === _checkPlayerTurnVictory() && board[2][2] === _checkPlayerTurnVictory()) {
            return true;
        } else {
            return false;
        }
    }

    const _checkBtmToRightdiagonal = (board) => {
        for (let i = 0; i<=2; i++) {
            if (board[2][0] === _checkPlayerTurnVictory() && board[1][1] === _checkPlayerTurnVictory() && board[0][2] === _checkPlayerTurnVictory()) {
                return true;
            } else {
                return false;
            }
        }
    }

    const hasVictory = () => {
        if (_checkVertical() || _checkHorizontal() || _checkTopToRightdiagonal() || _checkBtmToRightdiagonal()) {
            return true;
        } else {
            return false;
        }
    }

    return {
        hasVictory
    }
})()

