// representation of game

var _ = require('lodash');
var playerModel = require('./player');
var roundModel = require("./round");
var cardModel = require("./card")
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Card = cardModel.card;
var Round  = roundModel.round;
var Player = playerModel.player;
var PlayerSchema = playerModel.playerSchema

var GameSchema = new Schema({
  name:         String,
  player1:      PlayerSchema,
  player2:      PlayerSchema,
  currentHand:  PlayerSchema,
  currentRound: Object,
  rounds:       { type : Array , default : [] },
  score:        { type : Array , default : [0, 0] },
});



var Game= mongoose.model('Game',GameSchema);

Game.prototype.newRound = function(){
  var round = new Round(this, this.currentHand);
  this.currentRound = round;
  this.currentHand = this.switchPlayer(this.currentHand);
  this.rounds.push(round);

  return this;
}


Game.prototype.play = function(player, action, value){
  if(this.currentRound.currentTurn !== player)
    throw new Error("[ERROR] INVALID TURN...");

  if(this.currentRound.fsm.cannot(action))
    throw new Error("[ERROR] INVALID MOVE...");

  return this.currentRound.play(player,action, value);
};

Game.prototype.switchPlayer = function(player) {
  return (this.player1) === player ? (this.player2) : (this.player1);
};

module.exports.game = Game;







