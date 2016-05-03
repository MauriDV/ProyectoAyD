var cardModel = require('./card');
var deskModel = require('./deck');
var Deck = deskModel.deck;
var Card = cardModel.card;

function Player(name,card1,card2,card3){
	this.name=name;
	this.card1=card1;
	this.card2=card2;
	this.card3=card3;
};

Player.prototype.showCards = function() {
	return (this.card1.show() +" "+this.card2.show() +" "+ this.card3.show());
};

module.exports.player = Player;

carta1 = new Card("1","espada");
carta2 = new Card("12","oro");
carta3 = new Card("4","basto")
p = new Player("Mauri",carta1,carta2,carta3);

console.log(p.showCards());

d = new Deck();
cartas = d.mix();
console.log(cartas[1]);

