'use strict;'
var crypto = require('crypto');
var values = require('object.values');

if (!Object.values) {
    values.shim();
}

module.exports = function() {
    return {
        games : {},
        /*
         * Save the game inside the "db".
         */
        save(game) {
            game.game_id = crypto.randomBytes(20).toString('hex');
            this.games[game.game_id] = game;
            return game;
        },
        /*
         * Retrieve a game with a given id or return all the games if the id is undefined.
         * Return an error condition if the game is not found.
         */
        find(game_id) {
            if (game_id == undefined) {
                return Object.values(this.games);
            }
            if (!game_id in this.games) {
                return -1;
            }
            return this.games[game_id];

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
            this.games.game_id = game;
            return 1;
        }
    }
};
