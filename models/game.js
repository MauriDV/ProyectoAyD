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

console.log("++++++++++++++++++++++ RONDA 1 +++++++++++++++++++++++++++");

console.log(g.player1.showCards()+" <---- Player1 - "+g.player1.pointsCards+" - "+g.player1.aux);
console.log(g.player2.showCards()+" <---- Player2 - "+g.player2.pointsCards+" - "+g.player2.aux);

g.play(g.player1,"envido");
g.play(g.player2,"quiero");
g.play(g.player1,"playCard",g.player1.card1);
g.play(g.player2,"playCard",g.player2.card1);
g.play(g.player1,"truco");
g.play(g.player2,"quiero");
g.play(g.player1,"playCard",g.player1.card2)
g.play(g.player2,"playCard",g.player2.card2)
g.play(g.player2,"playCard",g.player2.card3)
g.play(g.player1,"playCard",g.player1.card3)

console.log(g.currentRound.esTruco+" - "+g.score);

g.newRound();

console.log("++++++++++++++++++++++ RONDA 2 +++++++++++++++++++++++++++");

console.log(g.player2.showCards()+" <---- Player2 - "+g.player2.pointsCards+" - "+g.player2.aux);
console.log(g.player1.showCards()+" <---- Player1 - "+g.player1.pointsCards+" - "+g.player1.aux);

g.play(g.player2,"playCard",g.player2.card1)
g.play(g.player1,"playCard",g.player1.card1)
g.play(g.player1,"playCard",g.player1.card2)
g.play(g.player2,"playCard",g.player2.card2)
g.play(g.player1,"playCard",g.player1.card3)
g.play(g.player2,"playCard",g.player2.card3)

console.log(g.score);











