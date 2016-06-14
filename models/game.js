var _ = require('lodash');
var deskModel = require('./deck');
var playerModel = require('./player');
var cardModel = require('./card');
var roundModel = require("./round");

var Round  = roundModel.round;
var Player = playerModel.player;
var Deck = deskModel.deck;
var Card = cardModel.card;

function Game(p1,p2){
	this.player1=p1;
	this.player2=p2;	
	this.rounds = [];
	this.currentHand=this.player1;
	this.currentRound=undefined;
	this.score = [0, 0];
};

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


p1 = new Player("Mauri");
p2 = new Player("Peluca");

g = new Game(p1,p2);

g.newRound();
g.play(p1,"playCard",p1.card1);
g.play(p2,"playCard",p2.card1);
g.play(p1,"playCard",p1.card2);
g.play(p2,"playCard",p2.card2);
g.play(p1,"playCard",p1.card3);
g.play(p2,"playCard",p2.card3);

console.log(g);






