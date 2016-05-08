var expect = require("chai").expect;
var cardModel = require("../models/card.js");

var Card = cardModel.card;

describe('Card', function() {

  describe("properties", function(){
    it('should have a suit property', function(){
      var c = new Card(1, 'oro');
      expect(c).to.have.property('suit');
    });

    it('should have a number property', function(){
      var c = new Card(1, 'oro');
      expect(c).to.have.property('number');
    });
  });


  describe("#show", function(){
    it('should returns card', function(){
      var c = new Card(1, 'copa');
      expect(c.show()).to.be.eq("1: copa");
    });
  });

  describe("#Compare", function(){
    var c1 = new Card(1, 'copa');
    var c2 = new Card(11, 'copa');
    var c3 = new Card(2, 'basto');
    describe("when suit of cards are equals", function(){
      it("should returns true", function(){
        expect(c1.compareSuit(c2)).to.be.eq(true);
      })
    });
    describe("when suit of cards are not equals", function(){
      it("should returns false", function(){
        expect(c1.compareSuit(c3)).to.be.eq(false);
      })
    });
  });

  describe("#confront", function(){
    var c = new Card(1, 'espada');
    var x = new Card(4, 'basto');
    var y = new Card(4, 'oro');
         
    describe("when this is better than argument", function(){
      it("should returns 1", function(){
        expect(c.confront(x)).to.be.eq(1);
      })
    });

    describe("when this is worst than argument", function(){
      it("should returns -1", function(){
        expect(x.confront(c)).to.be.eq-(1);
      })
    });

    describe("when this is better than argument", function(){
      it("should returns 1", function(){
        expect(y.confront(x)).to.be.eq(0);
      })
    });
  });
});

