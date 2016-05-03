var deskModel = require('./deck');
var Deck = deskModel.deck;

function Game(p1,p2,m){
	this.player1=p1;
	this.player2=p2;
	this.mazo=m;
};

Game.prototype.dealCards = function(p1,p2) {
	
};