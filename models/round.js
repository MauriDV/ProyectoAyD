/*
 * Round representation.
 */

/*
 *
 * Represents a game's round
 *
 * @param gmae [Object]: game where the round belongs
 *
 */

var _ = require('lodash');
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");
var mongoose = require("mongoose");
var deckModel = require("./deck");
var Deck  = deckModel.deck;


/*
* Maquina de estados
*/
function newTrucoFSM(){
  var fsm = StateMachine.create({
    initial: 'init',
    events: [
      { name: 'playCard', from: 'init',                           to: 'primercarta' },
      { name: 'envido',    from: ['init', 'primercarta'],         to: 'envido' },
      { name: 'envidox2',   from: 'envido'              ,            to: 'envidox2'},
      { name: 'truco',     from: ['init', 'playedcard','primercarta'
                                  ,'quiero','noQuiero'],          to: 'truco'  },
      { name: 'playCard', from: ['quiero', 'noQuiero',
                                  'primercarta', 'playedcard','quieroTruco'],  to: 'playedcard' },
      { name: 'quiero',    from: ['envidox2','envido'],              to: 'quiero'  },
      { name: 'noQuiero', from: ['envidox2','envido'], to: 'noQuiero' },
	  { name: 'reTruco' , from: 'truco' , to: 'reTruco' },
	  { name: 'quieroTruco' , from: ['truco','reTruco'], to: 'quieroTruco'},
	  { name: 'noQuieroTruco' , from: ['truco','reTruco'], to: 'noQuieroTruco'},

	],

    callbacks: {
      onchangestate: function(event, from, to) {
        if ((from=="envido")&&(to=="envidox2")){
          e=to
        }else{ 
        	if (to=="truco"){
          		e=to;
        	}else{
        		if (to=="reTruco"){
        			e=to;
        		}
        	}
        }		
 	  }
 	

 	}

  });

  return fsm;
}

e = "";

function Round(game, turn){
  this.game = game
  this.currentTurn = turn;
  this.fsm = newTrucoFSM();
  this.status = 'running';
  this.score = [0, 0];
  this.esTruco = false;
  this.esReTruco = false;
  this.playedCards = [];

}
/*
 * Creo un nuevo mazo y reparto 3 cartas para cada jugador
 */
Round.prototype.dealCards = function() {
  d = new Deck();
  cartas = d.mix();
  this.game.player1.setPointsCards(cartas[0],cartas[2],cartas[4]);
  this.game.player2.setPointsCards(cartas[1],cartas[3],cartas[5]);
};

Round.prototype.changeTurn = function(){
  return this.currentTurn = this.switchPlayer(this.currentTurn);
}

Round.prototype.posiblesStates = function() {
  return this.fsm.transitions();
};

Round.prototype.cartasJugadas = function() {
  return this.playedCards;
};

/*
 * returns the oposite player
 */
Round.prototype.switchPlayer = function(player) {
  return (this.game.player1) === player ? (this.game.player2) : (this.game.player1);
};

/*
 * Calculate the real score for envido and envido-envido
 */
Round.prototype.calculateScoreE = function(player,action){
  a = this.switchPlayer(player);
  if (action == "quieroTruco"){
  	if ( e== "truco"){
      	this.esTruco=true;
    }else{
      	if ( e== "reTruco"){
      		this.esTruco=true;
      		this.esReTruco=true;
      		this.changeTurn();
      	}
    }
    this.fsm.quieroTruco();
  }else if(action == "noQuieroTruco"){
  	if (e=="truco"){
      	this.score=[0,1];
      	this.status="stop"
      	this.fsm.noQuieroTruco();
    }else{
    	if (e=="reTruco"){
      		this.score=[0,2];
      		this.status="stop";
      		this.changeTurn();
      		this.fsm.noQuieroTruco();
      	}
    }
  }else if(action == "quiero"){
  	if(player.getPointsCards()>a.getPointsCards()){
        if (e=="envidox2") {
          	this.score=[0,4];
          	this.changeTurn()
        }else{
          	this.score=[0,2];
        }
    }else{
        if (e=="envidox2") {
          	this.score=[4,0];
          	this.changeTurn()
        }else{
          	this.score=[2,0]
        }
    }
    this.fsm.quiero();
  }else if(action == "noQuiero"){
  	if (e=="envidox2") {
        this.score = [0,2]
        this.changeTurn()
    }else{
        this.score = [0,1];
    };
    this.fsm.noQuiero();
}


    /*if(action == "quiero"){
    	if ( e== "truco"){
      		this.esTruco=true;
    	}else{
      		if ( e== "reTruco"){
      			this.esReTruco=true;
      			this.changeTurn();
      		}else{
  				if(player.getPointsCards()>a.getPointsCards()){
        			if (e=="envidox2") {
          				this.score=[0,4];
          				this.changeTurn()
        			}else{
          				this.score=[0,2];
        			}
      			}else{
        			if (e=="envidox2") {
          				this.score=[4,0];
          				this.changeTurn()
        			}else{
          				this.score=[2,0]
        			}
      			}
    		}
   	  	}	   	  	
    	this.fsm.quiero();
  	}else if(action == "noQuiero"){ 
    	if (e=="truco"){
      		this.score=[0,1];
      		this.status="stop"
      		this.fsm.noQuiero();
    	}else{
    		if (e=="reTruco"){
      			this.score=[0,2];
      			this.status="stop";
      			this.changeTurn();
      			this.fsm.noQuiero();
      			
    		}else{
      			if (e=="envidox2") {
        			this.score = [0,2]
        			this.changeTurn()
      			}else{
        			this.score = [0,1];
      			};
      		}
      	}	
      	this.fsm.noQuiero();
    }*/
  	
  if (player.getName()==this.game.player1.getName()) {
    if((action=='quiero')||(action=='quieroTruco')){
      var aux1 = this.score[1];
      var aux0 = this.score[0]
      this.score[0]=aux1;
      this.score[1]=aux0;
    }else{
      this.score=this.score;
    }
  }else{
    if((action=='noQuiero')||(action=='noQuieroTruco')){
      var aux1 = this.score[1];
      var aux0 = this.score[0]
      this.score[0]=aux1;
      this.score[1]=aux0;
    }else{
      this.score=this.score;
    }
  }
  this.game.score[0] += this.score[0];
  this.game.score[1] += this.score[1];
  e="";
  this.score=[0,0];
}

Round.prototype.confrontCards = function(player,card1,card2){
  i = card1.confront(card2);
  if(i==1 || i==0){
    p = this.switchPlayer(player);
    p.aux+=1;
  }else{
    player.aux+=1;
    this.changeTurn();
  }
};

Round.prototype.calculateScoreP = function(p1,p2) {
  if(p1.aux==2){
    this.game.player1.aux=0;
    this.game.player2.aux=0;
    this.status="stop";
    if(this.game.player1.name==p1.name){
      if(this.esReTruco==true){this.game.score[0]+=3
      }else{
		if(this.esTruco==true){this.game.score[0]+=2}else{this.game.score[0]+=1}
	  }
	}else{
      if(this.esReTruco==true){this.game.score[1]+=2
      }else{
		if(this.esTruco==true){this.game.score[0]+=2}else{this.game.score[0]+=1}
	  }
	}
  }else if(p2.aux==2){
    this.game.player1.aux=0;
    this.game.player2.aux=0;
    this.status="stop";
    if(this.game.player1.name==p2.name){
      if(this.esReTruco==true){this.game.score[0]+=3
      }else{
		if(this.esTruco==true){this.game.score[0]+=2}else{this.game.score[0]+=1}
	  }
    }else{
      if(this.esReTruco==true){this.game.score[1]+=3
      }else{
		if(this.esTruco==true){this.game.score[1]+=2}else{this.game.score[1]+=1}
	  }
    }
  }  
};

/*
 * Let's Play :)
 */

count = 0;
Round.prototype.play = function(player, action, value) {

  // move to the next state

  this.fsm[action];

  // if action is envido move to envido state  
  if (action=="envido") {
    this.fsm.envido();
  };

  // if action is envido-envido move to envidox2 state  
  if (action=="envidox2") {
    this.fsm.envidox2();
  };

  // if action is truco move to truco state  
  if (action=="truco"){
    this.fsm.truco();
  }

  if (action=="reTruco"){
    this.fsm.reTruco();
  }

  // if action is quiero or no quiero move to quiero state or noQuiero state 
  if (action=="quiero"||action=="noQuiero"||action=="quieroTruco"||action=="noQuieroTruco"){
    this.calculateScoreE(player,action);
  }
  console.log(this.fsm.posiblesStates);	

  if ((action=="playCard")&&(this.status=="running")){
    this.playedCards.push(value);
    if (value==player.card1)
      player.card1=null;
    else if(value == player.card2){
      player.card2=null;
    }else if(value==player.card3){
      player.card3=null;
    }
    if (count==0){
      valueAux = value;
      this.fsm.playCard();
      count++;
    }else{
      this.confrontCards(player,valueAux,value);
      this.calculateScoreP(player,this.switchPlayer(player));
      this.fsm.playCard();
      count=0;
    };
  };
  // Change player's turn
  return this.changeTurn();
};

module.exports.round = Round;
