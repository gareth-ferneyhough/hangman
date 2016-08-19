'use strict';

require('string.prototype.repeat');
var db = require('../util/db')();
var wordGenerator = require('../util/wordGenerator');
var values = require('object.keys');
if (!Object.keys) {
    keys.shim();
}

module.exports = { createGame, getOneGame, getAllGames, updateGame };

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
        state: '_'.repeat(randomWord.length)
    };
    res.json(db.save(game));
}
//GET /game/{game_id}
function getOneGame(req, res, next) {
    var id = req.swagger.params.game_id.value;
    var game = db.find(id);
    if (game) {
        delete game.word;
        res.json(game);
    } else {
        res.status(404).json({ message: 'game not found' });
    }
}
//PATCH /game/{id}
function updateGame(req, res, next) {
    var id = req.swagger.params.id.value;
    var game = req.body;
    if (db.update(id, game)) {
        res.json({ success: 1, description: "Game updated!" });
    } else {
        res.status(204).send();
    }

}
