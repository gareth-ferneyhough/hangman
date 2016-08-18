'use strict;'
var crypto = require('crypto');

module.exports = function() {
    return {
        games : {},
        /*
         * Save the game inside the "db".
         */
        save(game) {
            game.id = crypto.randomBytes(20).toString('hex');
            this.games[game.id] = game;
            return 1;
        },
        /*
         * Retrieve a game with a given id or return all the games if the id is undefined.
         * Return an error condition if the game is not found.
         */
        find(game_id) {
            if (this.game_id == undefined) {
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
