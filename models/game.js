var deskModel = require('./deck');
var playerModel = require('./player');
var cardModel = require('./card');
var Player = playerModel.player;
var Deck = deskModel.deck;
var Card = cardModel.card;

function Game(p1,p2){
	this.player1=p1;
	this.player2=p2;	
	this.currentHand=p1.name;
	this.currentRound=undefined;
	this.score = [0, 0];
};

Game.prototype.dealCards = function(pl1,pl2) {
	d = new Deck();
	cartas = d.mix();

	pl1.card1=cartas[0];
	pl2.card1=cartas[1];
	pl1.card2=cartas[2];
	pl2.card2=cartas[3];
	pl1.card3=cartas[4];
	pl2.card3=cartas[5];
	pl1.setPointsCards();
	pl2.setPointsCards();
};

Game.prototype.newRound = function(){
  var round = new Round(this, this.currentHand);
  this.currentRound = round;
  this.currentHand = (switchPlayer(this.currentHand)).name;
  this.rounds.push(round);

  return this;
}

function switchPlayer(player) {
  return player1 === player ? player2:player1;
};

module.exports.game = Game;


// play1=new Player("Eric");
// play2=new Player("Mauri");

// console.log(play1.name+" ---------- "+play2.name);

// juego = new Game(play1,play2);

// juego.dealCards(play1,play2);

// console.log("Cartas de "+play1.name+": "+play1.showCards());
// console.log("Puntos para el envido: "+play1.getPointsCards());

// console.log("Cartas de "+play2.name+": "+play2.showCards());
// console.log("Puntos para el envido: "+play2.getPointsCards());

// console.log("Eric dice: Envido");
// play1.aceptar=true;
// play2.aceptar=false;
// console.log(typeof(play2.aceptar));
// play1.envido(play2,2);

// console.log(play1.pointsGame);
// console.log(play2.pointsGame);

// console.log("Cartas de "+play1.name+": "+play1.showCards());
// console.log("Cartas de "+play2.name+": "+play2.showCards());

// console.log("Puntos de "+play1.name+": "+play1.getPoints());
// console.log("Puntos de "+play2.name+": "+play2.getPoints());

// console.log(play1.card1.show()+" contra "+play2.card1.show());
// console.log(play1.card1);
// console.log(play2.card1);
// juego.getPoints(play1.card1,play2.card1);


// console.log("Puntos de "+play1.name+": "+play1.getPoints());
// console.log("Puntos de "+play2.name+": "+play2.getPoints());

// console.log(play1.card2.show()+" contra "+play2.card2.show());
// console.log(play1.card2);
// console.log(play2.card2);
// juego.getPoints(play1.card2,play2.card2);


// console.log("Puntos de "+play1.name+": "+play1.getPoints());
// console.log("Puntos de "+play2.name+": "+play2.getPoints());

// console.log(play1.card3.show()+" contra "+play2.card3.show());
// console.log(play1.card3);
// console.log(play2.card3);
// juego.getPoints(play1.card3,play2.card3);


// console.log("Puntos de "+play1.name+": "+play1.getPoints());
// console.log("Puntos de "+play2.name+": "+play2.getPoints());


// var express = require('express');
// var app = express();
// var path = require('path');

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });

// app.listen(3000, function () {
//   console.log('Example app listening on port 3000!');
// });

