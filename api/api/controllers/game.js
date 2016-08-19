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
    res.json(db.save(game));
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
    return game_state.indexOf(guess) !== -1;
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
    if (!game.guesses_remaining) {
        res.json(game);
        return;
    }

    var word = game.word;
    var indices = word.everyIndex(guess);
    if (!indices.length || hasLetterAlreadyBeenGuessed(game.state, guess)) {
        game.bad_guesses.pushUnique(guess);
        game.guesses_remaining--;
        if (!game.guesses_remaining) {
            game.word = word; // if the user has used up all of his/her guesses, reveal the word
        }
    } else {
        for (var i = 0; i < indices.length; ++i) {
            game.state = game.state.replaceAt(indices[i], guess);
        }
        console.log(game.state);
        if (game.state.indexOf('_') === -1) {
            game.word = word; // if the user has used up all of his/her guesses, reveal the word
        }
    }
    db.update(game_id, game);
    // game still active; delete the word in play and return game state to user
    delete game.word;
    res.json(game);
}
