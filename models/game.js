var _ = require('lodash');
var playerModel = require('./player');
var roundModel = require("./round");
var cardModel = require("./card")
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Card = cardModel.card;
var Round  = roundModel.round;
var Player = playerModel.player;

var GameSchema = new Schema({
  name:         String,
  player1:      Object,
  player2:      Object,
  currentHand:  { type: Object, default: this.player1 },
  currentRound: Object,
  rounds:       { type : Array , default : [] },
  score:        { type : Array , default : [0, 0] },
});

var Game=mongoose.model("Game",GameSchema);

Game.prototype.play = function(player, action, value){
  console.log("EAEAEAA");
  if(this.currentRound.currentTurn !== player)
    throw new Error("[ERROR] INVALID TURN...");

  if(this.currentRound.fsm.cannot(action))
    throw new Error("[ERROR] INVALID MOVE...");

  return this.currentRound.play(player,action, value);
};

Game.prototype.newRound = function(){
  var round = new Round(this, this.currentHand);
  round.dealCards();
  this.currentRound = round;
  this.currentHand = this.switchPlayer(this.currentHand);
  this.rounds.push(round);

  return this;
}

Game.prototype.switchPlayer = function(player) {
  return (this.player1) === player ? (this.player2) : (this.player1);
};

module.exports.game = Game;


g = new Game();

g.player1=new Player({name:"Mauri",aux:0});
g.player2=new Player({name:"Lince De las praderan latinoamericanas",aux:0});
g.currentHand=g.player1;

g.newRound();

console.log(g.player1.showCards()+" - "+g.player1.pointsCards);
console.log(g.player2.showCards()+" - "+g.player2.pointsCards);

g.play(g.player1,"envido");
g.play(g.player2,"envidox2");
g.play(g.player1,"noQuiero");
// g.play(g.player2,"noQuiero");

console.log(g.score);











