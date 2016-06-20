
var expect = require("chai").expect;
var playerModel = require("../models/player");
var gameModel   = require("../models/game");
var roundModel   = require("../models/round");

var Game  = gameModel.game;
var Round = roundModel.round;
var Player = playerModel.player;

describe('Round', function(){
 var game;

  beforeEach(function(){
    game = new Game();
    game.player1 = new Player({ name: 'mauricio' });
    game.player2 = new Player({ name: 'patricio' });
    game.newRound();
  });

  describe("#dealCards", function(){
    it("should populate player1 cards", function(){
      var round = new Round(game);
      round.dealCards();
			
			expect(game.player1.card1).to.not.be.a('null');
			expect(game.player1.card2).to.not.be.a('null');
			expect(game.player1.card3).to.not.be.a('null');
			
    });

    it("should populate player2 cards", function(){
      var round = new Round(game);
      round.dealCards();
	
      expect(game.player2.card1).to.not.be.a('null');
			expect(game.player2.card2).to.not.be.a('null');
			expect(game.player2.card3).to.not.be.a('null');
    });
  });

	describe("#changeTurn", function(){
		it("should change the player's turn ",function(){
			var round = new Round(game,game.player1);			
			round.changeTurn();
			
			expect(round.currentTurn.getName()).to.be.equals(game.player2.getName());
		});
	});

	describe("#switchPlayer", function(){
		it("should be the oposite player", function(){
			var round = new Round(game,game.player1);
			expect(round.switchPlayer(game.player1).getName()).to.be.equals(game.player2.getName());		
		});	
	});




});
