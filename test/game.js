var expect = require("chai").expect;
var gameModel = require("../models/game");
var playerModel = require("../models/player");
var cardModel = require("../models/card");

var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;

describe('Game', function() {
  var game;

  beforeEach(function(){
    game = new Game();
    game.player1 = new Player({ name: 'mauricio',aux:0});
    game.player2 = new Player({ name: 'patricio',aux:0});
		game.currentHand=game.player1;    
		game.newRound();
    // Force to have the following cards and envidoPoints
    game.player1.setPointsCards(
        new Card(1, 'copa'),
        new Card(7, 'oro'),
        new Card(2, 'oro')
    );

    game.player2.setPointsCards(
        new Card(6, 'copa'),
        new Card(7, 'copa'),
        new Card(2, 'basto')
    );
  });

	it('should save a game', function(done){
    var game = new Game({ currentHand: 'player1' });
    player1 = new Player({ name: 'mauricio' });
    player2 = new Player({ name: 'patricio' });

    player1.save(function(err, player1) {
      if(err)
        done(err)
      game.player1 = player1;
      player2.save(function(err, player2) {
        if(err)
          done(err)
       game.player2 = player2;
        game.save(function(err, model){
          if(err)
            done(err)
          expect(model.player1.nickname).to.be.eq('J');
          expect(model.player2.nickname).to.be.eq('X');
          done();
        });
      })
    });
  });	

  it('plays [envido, quiero] should gives 2 points to winner', function(){
    game.play(game.player1, 'envido');
    game.play(game.player2, 'quiero');

		expect(game.score[0]).to.be.equals(0);
		expect(game.score[1]).to.be.equals(2);
    
  });

	it('plays [envido, noQuiero] should gives 1 points to winner', function(){
    game.play(game.player1, 'envido');
    game.play(game.player2, 'noQuiero');

		expect(game.score[0]).to.be.equals(1);
		expect(game.score[1]).to.be.equals(0);
    
  });

	it('plays [envido, envidox2, quiero] should gives 4 points to winner', function(){
    game.play(game.player1, 'envido');
    game.play(game.player2, 'envidox2');
		game.play(game.player1, 'quiero');

		expect(game.score[0]).to.be.equals(0);
		expect(game.score[1]).to.be.equals(4);
    
  });

	it('plays [envido, envidox2, noQuiero] should gives 2 points to winner', function(){
    game.play(game.player1, 'envido');
    game.play(game.player2, 'envidox2');
		game.play(game.player1, 'noQuiero');

		expect(game.score[0]).to.be.equals(0);
		expect(game.score[1]).to.be.equals(2);
  });

	it('plays [playCard, playCard, playCard,playCard,playCard,playCard] should gives 1 points to winner', function()	{    
		game.play(game.player1,'playCard',game.player1.card1);
    game.play(game.player2,'playCard',game.player2.card3);
		game.play(game.player2,'playCard',game.player2.card1);
		game.play(game.player1,'playCard',game.player1.card2);
		game.play(game.player1,'playCard',game.player1.card3);
		game.play(game.player2,'playCard',game.player2.card2);
		expect(game.score[0]).to.be.equals(1);
		expect(game.score[1]).to.be.equals(0);
    
  });

	it('plays [playCard, playCard,playCard,truco,quiero,playCard] should gives 2 points to winner', function()	{    
		game.play(game.player1,'playCard',game.player1.card1);
    game.play(game.player2,'playCard',game.player2.card1);
		game.play(game.player1,'playCard',game.player1.card2);
		game.play(game.player2,'truco');
		game.play(game.player1,'quiero');
		game.play(game.player2,'playCard',game.player2.card3);
		expect(game.score[0]).to.be.equals(2);
		expect(game.score[1]).to.be.equals(0);
    
  });


});
