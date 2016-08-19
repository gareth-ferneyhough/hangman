var game_id = '';

function formatWordInPlay(wordInPlay) {
    return wordInPlay.split('').join('  ');
}

function updatePage(gameState) {
    var guessesRemainingElement = document.getElementById('guesses_remaining');
    var gameBoardElement = document.getElementById('game_board');
    guessesRemainingElement.innerHTML = 'Guesses Remaining: ' + gameState.guesses_remaining;
    gameBoardElement.innerHTML = formatWordInPlay(gameState.state);
    game_id = gameState.game_id;
    console.log(gameState);
}

function startNewGame() {
    var myHeaders = new Headers();
    var myInit = { method: 'POST' };

    fetch('/game', myInit)
    .then(function(response) {
        response.json().then(json => {
            updatePage(json);
        });
  });
}

function playTurn() {
    var guess = document.getElementById('guess').value;
    if (guess.length !== 1) {
        alert('You must guess a single letter');
        return;
    }

    var myHeaders = new Headers();
    var myInit = { method: 'PATCH' };

    fetch(`/game/${game_id}?guess=${guess}`, myInit)
    .then(function(response) {
        response.json().then(json => {
            updatePage(json);
        });
  });
}
