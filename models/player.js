/*
 * Player representation.
 */


var Player = function(n){
	this.name = n;
	this.aux = 0;
	this.card1 = null;
	this.card2 = null;
	this.card3 = null;
}

//calculate the points for three cards 
Player.prototype.setPointsCards = function(c1,c2,c3) {
  this.card1=c1;
  this.card2=c2;
  this.card3=c3;
  this.pointsCards = Math.max(this.card1.pointsEnvido(this.card2),this.card1.pointsEnvido(this.card3),this.card2.pointsEnvido(this.card3));
};

//Show cards of this player
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

module.exports.player = Player;




