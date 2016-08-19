'use strict';
   // Include our "db"
   var db = require('../../config/db')();
   // Exports all the functions to perform on the db
   module.exports = { createGame, getOneGame, getAllGames, updateGame };

   //GET /game
   function getAllGames(req, res, next) {
     res.json({ games: db.find()});
   }
   //POST /game
   function createGame(req, res, next) {
       var game = {
           word: 'hello',
           guess_remaining: 5,
           number_of_letters: 5,
           state: '_____'
       }
       res.json(db.save(game));
   }
   //GET /game/{game_id}
   function getOneGame(req, res, next) {
       var id = req.swagger.params.game_id.value; //req.swagger contains the path parameters
       var game = db.find(id);
       if(game) {
           res.json(game);
       }else {
           res.status(404).json({message: 'no game with provided id not found'});
       }
   }
   //PATCH /game/{id}
   function updateGame(req, res, next) {
       var id = req.swagger.params.id.value; //req.swagger contains the path parameters
       var game = req.body;
       if(db.update(id, game)){
           res.json({success: 1, description: "Game updated!"});
       }else{
           res.status(204).send();
       }

   }
   //DELETE /movie/{id} operationId
   function delMovie(req, res, next) {
       var id = req.swagger.params.id.value; //req.swagger contains the path parameters
       if(db.remove(id)){
           res.json({success: 1, description: "Movie deleted!"});
       }else{
           res.status(204).send();
       }
   }
