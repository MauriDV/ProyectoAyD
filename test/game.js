var expect = require("chai").expect;
var gameModel = require("../models/game");
var playerModel = require("../models/player");
var cardModel = require("../models/card");

var Game = gameModel.game;
var Player = playerModel.player;
var Card = cardModel.card;

describe('Game', function() {

  describe('#Deal Cards', function() {

    it('#Players have cards', function(){
      jugador1 = new Player("P1");
      jugador2 = new Player("P2");
      var g = new Game(jugador1,jugador2);
      g.dealCards(jugador1,jugador2);
      expect(jugador1.card1).to.not.be.a('null');
      expect(jugador1.card2).to.not.be.a('null');
      expect(jugador1.card3).to.not.be.a('null');
      expect(jugador2.card1).to.not.be.a('null');
      expect(jugador2.card2).to.not.be.a('null');
      expect(jugador2.card3).to.not.be.a('null');
    });

  });

  describe("#Points of cards", function(){

    describe("when cards are 11-12 or 12-11", function(){
      var c1 = new Card(12, 'copa');
      var c2 = new Card(11, 'copa');
      var c3 = new Card(2, 'basto');

      it("should returns 20", function(){
        jugador = new Player("jugador",c1,c2,c3);
        jugador.setPointsCards();
        expect(jugador.getPointsCards()).to.be.eq(20);
      });
      it("should returns 20", function(){
        jugador = new Player("jugador",c2,c1,c3);
        jugador.setPointsCards();
        expect(jugador.getPointsCards()).to.be.eq(20);
      });

    });

    describe("when cards are y-x or x-y where x<11 and y>=11", function(){
      var c1 = new Card(12, 'copa');
      var c2 = new Card(4, 'copa');
      var c3 = new Card(2, 'basto');

      it("should returns 24 (y-x)", function(){
        jugador = new Player("jugador",c1,c2,c3);
        jugador.setPointsCards();
        expect(jugador.getPointsCards()).to.be.eq(24);
      });

      it("should returns 24 (x-y)", function(){
        jugador = new Player("jugador",c2,c1,c3);
        jugador.setPointsCards();
        expect(jugador.getPointsCards()).to.be.eq(24);
      });

    });

    describe("when cards are y-x (x<11 and y<11)", function(){
      var c1 = new Card(7, 'copa');
      var c2 = new Card(2, 'copa');
      var c3 = new Card(2, 'basto');

      it("should returns 29", function(){
        jugador = new Player("jugador",c1,c2,c3);
        jugador.setPointsCards();
        expect(jugador.getPointsCards()).to.be.eq(29);
      });

    });

  });

});
