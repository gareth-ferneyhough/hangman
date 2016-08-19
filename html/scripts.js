var game_id = '';

function formatWordInPlay(wordInPlay) {
    return wordInPlay.split('').join('  ');
}

function formatBadGuesses(bad_guesses) {
    return bad_guesses.join('  ');
}

function updatePage(gameState) {
    var guessesRemainingElement = document.getElementById('guesses_remaining');
    var gameBoardElement = document.getElementById('game_board');
    var badGuessesElement = document.getElementById('bad_guesses');
    guessesRemainingElement.innerHTML = 'Guesses Remaining: ' + gameState.guesses_remaining;
    gameBoardElement.innerHTML = formatWordInPlay(gameState.state);
    badGuessesElement.innerHTML = formatBadGuesses(gameState.bad_guesses);

    game_id = gameState.game_id;
    if (!gameState.guesses_remaining) {
        document.getElementById('won_message').innerHTML = 'You Lost!';
    } else if (gameState.state.indexOf('_') === -1) {
        document.getElementById('won_message').innerHTML = 'You Won!';
    } else {
        document.getElementById('won_message').innerHTML = '';
    }
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
