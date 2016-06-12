/*
 *
 * Represents a game's round
 *
 * @param gmae [Object]: game where the round belongs
 *
 */

var _ = require('lodash');
var StateMachine = require("../node_modules/javascript-state-machine/state-machine.js");
var deckModel = require("./deck");
var Deck  = deckModel.deck;

function newTrucoFSM(){
  var fsm = StateMachine.create({
    initial: 'init',
    events: [
      { name: 'playCard', from: 'init',                           to: 'primercarta' },
      { name: 'envido',    from: ['init', 'primercarta'],         to: 'envido' },
      { name: 'envidox2',   from: 'envido'              ,            to: 'envidox2'},
      { name: 'truco',     from: ['init', 'playedcard'],          to: 'truco'  },
      { name: 'playCard', from: ['quiero', 'noQuiero',
                                  'primercarta', 'playedcard'],  to: 'playedcard' },
      { name: 'quiero',    from: ['envidox2','envido', 'truco'],              to: 'quiero'  },
      { name: 'noQuiero', from: ['envidox2','envido', 'truco'],              to: 'noQuiero' },
    ],

    callbacks: {
      onchangestate: function(event, from, to) {if ((from=="envido")&&(to=="envidox2")) e=to}
    }

  });

  return fsm;
}

e = false;

function Round(game, turn){
  /*
   * Game
   */
  this.game = game;

  /*
   * next turn
   */
  this.currentTurn = turn;

  /*
   * here is a FSM to perform user's actions
   */
  this.fsm = newTrucoFSM();

  /*
   *
   */
  this.status = 'running';

  /*
   * Round' score
   */
  this.score = [0, 0];
}


/*
 * Generate a new deck mixed and gives to players the correspondent cards
 */
Round.prototype.dealCards = function() {
  d = new Deck();
  cartas = d.mix();

  this.game.player1.card1=cartas[0];
  this.game.player2.card1=cartas[1];
  this.game.player1.card2=cartas[2];
  this.game.player2.card2=cartas[3];
  this.game.player1.card3=cartas[4];
  this.game.player2.card3=cartas[5];
  this.game.player1.setPointsCards();
  this.game.player2.setPointsCards();
};


Round.prototype.changeTurn = function(){
   return this.currentTurn = this.switchPlayer(this.currentTurn);
}

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
  if(action == "quiero"){
    if(player.getPointsCards()>a.getPointsCards()){
      if (e=="envidox2") {
        this.score=[4,0];
      }else{
        this.score=[0,2]
      }
    }else{
      if (e=="envidox2") {
        this.score=[0,4];
      }else{
        this.score=[2,0]
      }
    }
    this.fsm.quiero();
  }else if(action == "noQuiero"){ 
    if (e=="envidox2") {
      this.score = [0,2]
    } else{
      this.score = [0,1];
    };
    this.fsm.noQuiero(); 
  }

  this.game.score[0] += this.score[0];
  this.game.score[1] += this.score[1];
  e="";

  return this.score;
}

/*
 * Let's Play :)
 */
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

  // if action is quiero or no quiero move to quiero state or noQuiero state 
  if (action=="quiero"||action=="noQuiero"){
    this.calculateScoreE(player,action);
  }

  // Change player's turn
  return this.changeTurn();
};

module.exports.round = Round;
