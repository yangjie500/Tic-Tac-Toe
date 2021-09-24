const preGameModal = (() => {
    const selectPlayer = document.querySelector('.player2');
    const selectBot = document.querySelector('.computer');
    const selectReturn = document.querySelectorAll('.return');
    const choosingDiv = document.querySelector('.choosing');
    const startGameBtn = document.querySelector('.start-btn');
    const playerOneInput = document.querySelector(`input[data-player='1']`);
    const playerTwoInput = document.querySelector(`input[data-player='2']`);
    const computerInput = document.querySelectorAll(`input[data-computer]`);
    let choosePlayer;
    let computerDifficulty;

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
        choosePlayer = true;
    });

    selectBot.addEventListener('click', () => {
        _toggleClose();
        _toggleOpen('computer-choosen');
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
        player
        if (choosePlayer) {
            console.log('PlayerChoosen');
        } else {
            console.log('ComputerChoosen');
            computerDifficulty = document.querySelector('input[name="difficulty"]:checked').id;
            console.log(computerDifficulty);
        }
    })


    return {
        
    };
})();

const player = (() => {

})

const gameBoard = (() => {
    const _board = [[0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]]


})();

