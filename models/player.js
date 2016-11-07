/*
 * Player representation.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlayerSchema = new Schema({
  name: String,
  aux: {type:Number,default:0}
});

//calculate the points for three cards 
PlayerSchema.methods.setPointsCards = function(c1,c2,c3) {
  this.card1=c1;
  this.card2=c2;
  this.card3=c3;
  this.pointsCards = Math.max(this.card1.pointsEnvido(this.card2),this.card1.pointsEnvido(this.card3),this.card2.pointsEnvido(this.card3));
};

//Show cards of this player
PlayerSchema.methods.showCards = function() {
	return (this.card1.show() +" "+this.card2.show() +" "+ this.card3.show());
};

//return the name of de player
PlayerSchema.methods.getName = function() {
	return this.name;
};

//return the points of the cards to play envido
//retorno los puntos de las cartas para jugar envido
PlayerSchema.methods.getPointsCards = function() {
	return this.pointsCards;
};

var Player = mongoose.model('Player', PlayerSchema);


module.exports.player = Player;
module.exports.playerSchema = PlayerSchema;




