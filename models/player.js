var cardModel = require('./card');
var deskModel = require('./deck');
var roundModel = require('./round');

var Round = roundModel.round;
var Deck = deskModel.deck;
var Card = cardModel.card;

function Player(name,card1,card2,card3){
	this.name=name;
	this.card1=card1;
	this.card2=card2;
	this.card3=card3;
	this.pointsCards=0; //Points of cards
};

Player.prototype.showCards = function() {
	return (this.card1.show() +" "+this.card2.show() +" "+ this.card3.show());
};

//return the name of de player
Player.prototype.getName = function() {
	return this.name;
};

//return the points of the cards to play envido
Player.prototype.getPointsCards = function() {
	return this.pointsCards;
};

//calculate the points for three cards 
Player.prototype.setPointsCards = function() {
	this.pointsCards = Math.max(this.card1.pointsEnvido(this.card2),this.card1.pointsEnvido(this.card3),this.card2.pointsEnvido(this.card3));
};

module.exports.player = Player;





