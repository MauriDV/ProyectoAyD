var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'Player'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  aux: {type:Number,default:0}
});

var Player = mongoose.model('Player', PlayerSchema);

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

//calculate the points for three cards 
Player.prototype.setPointsCards = function(c1,c2,c3) {
	this.card1=c1;
	this.card2=c2;
	this.card3=c3;
	this.pointsCards = Math.max(this.card1.pointsEnvido(this.card2),this.card1.pointsEnvido(this.card3),this.card2.pointsEnvido(this.card3));
};

module.exports.player = Player;





