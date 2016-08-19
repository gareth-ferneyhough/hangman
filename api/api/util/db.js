'use strict;'
var crypto = require('crypto');
var values = require('object.values');

if (!Object.values) {
    values.shim();
}

module.exports = function () {
    return {
        games: {},
        /*
         * Save the game inside the "db".
         */
        save(game) {
            // clone game before saving
            var game_to_save = JSON.parse(JSON.stringify(game));
            game_to_save.game_id = crypto.randomBytes(20).toString('hex');
            this.games[game_to_save.game_id] = game_to_save;
            // return a cloned representation of the game object
            return JSON.parse(JSON.stringify(game_to_save));
        },
        /*
         * Retrieve a game with a given id or return all the games if the id is undefined.
         * Return an error condition if the game is not found.
         */
        find(game_id) {
            if (game_id == undefined) {
                return this.games;
            }
            if (!game_id in this.games) {
                return -1;
            }
            // return a cloned representation of the game object
            var game = JSON.parse(JSON.stringify(this.games[game_id]));
            return game;
        },
        /*
         * Delete a game with the given id.
         */
        remove(game_id) {
            if (!game_id in this.games) {
                return -1;
            }
            delete this.games.game_id;
            return 1;
        },
        /*
         * Update a game with the given id
         */
        update(game_id, game) {
            if (!game_id in this.games) {
                return -1;
            }
            this.games[game_id] = JSON.parse(JSON.stringify(game));
            return 1;
        }
    }
};
