'use strict';

require('string.prototype.repeat');
var db = require('../util/db')();
var wordGenerator = require('../util/wordGenerator');
var values = require('object.keys');
if (!Object.keys) {
    keys.shim();
}

module.exports = { createGame, getOneGame, getAllGames, updateGame };

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

String.prototype.everyIndex = function(character) {
    var indices = [];
    for(var i=0; i<this.length; i++) {
        if (this[i] === character) {
            indices.push(i);
        }
    }
    return indices;
}

Array.prototype.pushUnique = function(item) {
    if (this.indexOf(item) !== -1) {
        return this;
    }
    return this.push(item);
}

//GET /game
function getAllGames(req, res, next) {
    var games = db.find();
    res.json(Object.keys(games));
}
//POST /game
function createGame(req, res, next) {
    var randomWord = wordGenerator.getRandomWord('hard');
    var game = {
        word: randomWord,
        guesses_remaining: 8,
        number_of_letters: randomWord.length,
        state: '_'.repeat(randomWord.length),
        bad_guesses: []
    };
    var saved_game = db.save(game);
    delete saved_game.word;
    res.json(saved_game);
}
//GET /game/{game_id}
function getOneGame(req, res, next) {
    var id = req.swagger.params.game_id.value;
    var game = db.find(id);
    if (!game) {
        res.status(404).json({ message: 'game not found' });
        return;
    }
    delete game.word;
    res.json(game);
}

function hasLetterAlreadyBeenGuessed(game_state, guess) {
    var res = game_state.indexOf(guess) !== -1;
    return res;
}

function hasGameBeenLost(game) {
    return !game.guesses_remaining;
}

function hasGameBeenWon(game) {
    console.log('hasGameBeenOne', game);
    return (game.state.indexOf('_') === -1 && game.guesses_remaining);
}

function getUpdatedGameState(game, guess) {
    var word = game.word;
    var indicesOfGuessedLetter = word.everyIndex(guess);
    var newGameState = game.state;
    for (var i = 0; i < indicesOfGuessedLetter.length; ++i) {
        newGameState = newGameState.replaceAt(indicesOfGuessedLetter[i], guess);
    }
    return newGameState;
}

function isLetterInSolution(word, guess) {
    return word.indexOf(guess) !== -1;
}

//PATCH /game/{id}
function updateGame(req, res, next) {
    var game_id = req.swagger.params.game_id.value;
    var guess = req.swagger.params.guess.value;
    var game = db.find(game_id);
    if (!game) {
        res.status(404).json({ message: 'game not found' });
        return;
    }
    if (guess.length !== 1) {
        res.status(400).json({ message: 'guess must be one character' });
        return;
    }
    if (hasGameBeenLost(game)|| hasGameBeenWon(game)) {
        res.json(game); // don't do anything if the game is in lost, or won state
        return;
    }

    var shouldRemoveSolution = true;
    if (!isLetterInSolution(game.word, guess) || hasLetterAlreadyBeenGuessed(game.state, guess)) {
        game.bad_guesses.pushUnique(guess);
        game.guesses_remaining--;
        if (!game.guesses_remaining) {
            shouldRemoveSolution = false; // if the user has used up all of his/her guesses, reveal the word
        }
    } else {
        game.state = getUpdatedGameState(game, guess);
        if (hasGameBeenWon(game)) {
            shouldRemoveSolution = false; // if the user has won the game, reveal the word
        }
    }
    db.update(game_id, game);
    if (shouldRemoveSolution) {
        delete game.word; // don't return the word to the user (unless we re-add it further down)
    }
    res.json(game);
}
