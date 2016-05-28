var cardModel = require('./card');
var deskModel = require('./deck');
var Deck = deskModel.deck;
var Card = cardModel.card;

function Player(name,card1,card2,card3){
	this.name=name;
	this.card1=card1;
	this.card2=card2;
	this.card3=card3;
	this.pointsCards=0; //Puntos de cartas.
	this.pointsGame=0; //Puntos del juego.
	this.aceptar=null;
};

Player.prototype.showCards = function() {
	return (this.card1.show() +" "+this.card2.show() +" "+ this.card3.show());
};

Player.prototype.getPointsCards = function() {
	return this.pointsCards;
};

Player.prototype.setPointsCards = function() {
	this.pointsCards = Math.max(countPoints(this.card1,this.card2),countPoints(this.card2,this.card3),countPoints(this.card1,this.card3));
};

Player.prototype.envido = function(jugador,n) {
	if (jugador.aceptar=="envido"){
		jugador.envido(this,4);
	}else{
		if (jugador.aceptar==true){
			if(this.getPointsCards()>jugador.getPointsCards()){
				this.pointsGame+=n;
			}else if(this.getPointsCards()<jugador.getPointsCards()){
				jugador.pointsGame+=n
			}
		}else{
			this.pointsGame+=n/2;
		}
	}
	jugador.aceptar=null;
	this.aceptar=null;
};

countPoints = function (c1,c2){
	if(c1.compareSuit(c2)){
		if (c1.number>=11 && c2.number>=11){
			return 20;
		}else if(c1.number>=11 && c2.number<11){
			return (10+c2.number)+10;
		}else if(c1.number<11 && c2.number>=11){
			return (10+c1.number)+10;
		}else if(c1.number<11 && c2.number<11){
			return (c1.number+c2.number)+20;
		}
	}else{
		return Math.max(c1.number,c2.number);
	}
}

module.exports.player = Player;





