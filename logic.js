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

const computerAi = ((name='computer', difficulty, display=2) => {
    return {
        name,
        display,
        difficulty
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

    const _getCurrentPlayer = () => {
        isComputer = preGameModal.playerSelected.playerTwo ? false : true;
        if (gameRound % 2 === 1) {
            currentPlayer = preGameModal.playerSelected.playerOne;
            console.log(currentPlayer);
        } else if (isComputer === false && gameRound % 2 === 0) {
            currentPlayer = preGameModal.playerSelected.playerTwo;
            console.log(currentPlayer);
        } else {
            currentPlayer = preGameModal.playerSelected.computer;
            console.log(currentPlayer);
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
            _addEndGameMessage(endGameMessage, currentPlayer.name)
        } else if (result === 'draw') {
            endGameMessage = 'Draw';
            _addEndGameMessage(endGameMessage, currentPlayer.name)
        } else {
            return;
        }
        grids.forEach( (elem) => {
            elem.removeEventListener('click', (e) => {
                e.target.classList.toggle(displayClass);
                result = gameBoard.updateBoard(gridSelected, currentPlayer);
            });
        });
    }

    const _addEndGameMessage = (message, who) => {
        const endModal = document.querySelector('.end-modal');
        const htmlWho = document.querySelector('.end-modal h3');
        const htmlMessage = document.querySelector('.end-modal p');
        const restartBtn = document.querySelector('.end-modal .restart');
        
        endModal.style.display = 'block';
        htmlWho.textContent = who;
        if (message === 'Draw') {
            console.log('HELLO');
            htmlWho.textContent = 'Both';
            htmlMessage.textContent = message;
        }

        restartBtn.addEventListener('click', (e) => {
            window.location.reload();
        })
    }

    grids.forEach( elem => {
        elem.addEventListener('click', e => {
            _getCurrentPlayer();

            e.target.classList.toggle(displayClass);
            gridSelected = (e.target.getAttribute('data-grid'));
            result = gameBoard.updateBoard(gridSelected, currentPlayer);
            _endGame(result, currentPlayer);
            _switchTurn();
        }, {once: true});
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
        
        if (gameRound === 9 && win === false) {
            return 'draw'
        }
        return win;      
    }

    return {
        hasVictory
    }
})()
