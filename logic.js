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
            playerTwo = player(playerTwoInput.value, display='2');
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
    return playerSelected;
})();

const player = ((name, display='1') => {
    return {
        name,
        display
    };
})

const computerAi = ((difficulty, display='2') => {
    return {
        display
    }
})

const gameBoard = (() => {
    const _board = [[0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]]

    const getBoard = () => _board

    const updateBoard = () => {

    }
    return {
        getBoard
    }

})();

const game = (() => {
    const grids = document.querySelectorAll('.grid-child');
    let displayClass = 'choosenX';
    let gameRound = 1;
    const temp = {gameRounds: 1};
    let gridSelected = [];

    const _nextRound = () => {
        gameRound++;
        temp['gameRounds']++;
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
            e.target.classList.toggle(displayClass);
            gridSelected.push(e.target.getAttribute('data-grid'));
            _switchTurn();
        }, {once: true});
    });

    return {
        gridSelected
    }
})()

