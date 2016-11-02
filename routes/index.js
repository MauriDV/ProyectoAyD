var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var mongoose = require('mongoose');
var Player = require('../models/player').player
var Deck = require('../models/deck').deck
var Card = require('../models/card').card
var Round = require('../models/round').round
var router = express.Router();

var Game = require("../models/game").game;

g = undefined;

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user : req.user});
});

//REGISTER

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', { user : user });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

// LOGIN

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
    console.log("SESION DE: "+req.session.passport.user);
    var userSession = req.session.passport.user;
});

// LOGOUT

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/createNewGame', function(req,res) {
    res.render('newGame'); 
});

router.post('/createNewGame', function(req,res) {
    var jugador1 = new Player(req.session.passport.user);
    var jugador2 = new Player(null);
	var g = new Game({
          name : req.body.nGame,
    	  player1 : jugador1,
          player2 : jugador2,
          currentHand : jugador1,
    }); 
    g.newRound();
    g.currentRound.dealCards()
	g.save(function(err,juego){
		if (err){
             	console.log("ERROR: "+err);
        }
		else{
			res.redirect("/play?idPartida="+juego._id);		
		}
	})
    // jugador1.save(function(err,p1){
    //     if (err){
    //         console.log("ERROR j1: "+err);
    //     }
    //     jugador2.save(function(err,p2) {
    //         if (err){
    //             console.log("ERROR j2: "+err);
    //         }
    //         var game = new Game({
    //             name : req.body.nGame,
    //             player1 : p1,
    //             player2 : p2,
    //             currentHand : p1
    //         });
    //         game.save(function (err,g) {
    //             if (err){
    //                 console.log("ERROR: "+err);
    //             }
    //             res.redirect('/newRound?gId='+g._id);
    //         });
    //     });
    // });
})

router.get('/newRound',function(req,res) {

    g.newRound();
    g.currentRound.dealCards();
    res.redirect("/play");
})

router.get('/play',function(req,res){

    Game.findOne({_id:req.query.idPartida},function(err,g){
        if(err){
            console.log("ERROR: "+err);
        }else{
            if(g.player2.name==null){
                if(req.session.passport.user!=g.player1.name){
                    g.player2.name = req.session.passport.user;
                }
            }
            var p = g.currentRound;
            p = p.__proto__ = Round.prototype
            if(g.player1.name == req.session.passport.user){
                p.player1 = g.player1;
                p.player2 = g.player2;
            }else{
                p.player1 = g.player2;
                p.player2 = g.player1;
            }
            p.status = 'running'
            p.estadosPosibles = p.newTrucoFSM(g.currentRound.fsm.current).transitions();
            p.playedCards = p.cartasJugadas();
            p.currentTurn = p.player2;
            g.currentRound = p
            res.render("play",{juego:g,us:req.session.passport.user,p1:p.player1.name,p2:p.player2.name,estados:p.estadosPosibles});
        }
    });
    // var juego = Game.findOne({_id:req.query.gId},function(err,game){
    //     if (err){
    //         console.log("ERROR: "+err);
    //     }
    //     console.log("Jugador 1: "+game.player1.getName());
    //     console.log("Jugador 2: "+game.player2.getName());
    //     console.log("CurrentHand: "+game.currentHand.getName()); 
    //     console.log("CurrentRound: "+game.currentRound);   // CURRENTROUND ES UNDEFINED
    //     console.log("ID del game: "+game._id);
    //     res.render("play",{juego:game});
    // })
});

router.post('/play',function(req,res){
    var idGame = req.body.idPartida;
    var estado=req.body.action;

    Game.findOne({_id:idGame},function(err,g){

        var p = g.currentRound;
        p = p.__proto__ = Round.prototype;
        p.fsm = p.newTrucoFSM(g.currentRound.fsm.current)
        p.playedCards = g.currentRound.playedCards;
        g.currentRound = p;
        console.log(g.currentRound.fsm.current);
        console.log(g.currentRound.currentTurn.name)
        if(err){
            console.log("error recuperando partida")
        }
        if (estado=='envido'){
            g.play(g.currentRound.currentTurn,estado);
        }
        if (estado=='envidox2'){
            g.play(g.currentRound.currentTurn,estado)
        }
        if (estado=='quiero'){
            g.play(g.currentRound.currentTurn,estado);
        }
        if (estado=='noQuiero'){
            g.play(g.currentRound.currentTurn,estado);
        }
        if (estado=='truco'){
            g.play(g.currentRound.currentTurn,estado)
        }
        if (estado=="Jugar Carta #1"){
        	var realCard = new Card(g.currentRound.currentTurn.card1.number,g.currentRound.currentTurn.card1.suit);
            g.play(g.currentRound.currentTurn,"playCard",realCard);
        }
        if (estado=="Jugar Carta #2"){
            g.play(g.currentRound.currentTurn,"playCard",g.currentRound.currentTurn.card2)
        }
        if (estado=="Jugar Carta #3"){
            g.play(g.currentRound.currentTurn,"playCard",g.currentRound.currentTurn.card3)
        }
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        console.log(g.currentRound.fsm.current);
        console.log(g.currentRound.currentTurn.name)
        
        Game.findOne({_id:idGame}, function(err,juego){
        	var p = juego.currentRound;
       		p = p.__proto__ = Round.prototype;
       		console.log("p.fsm")
       		console.log(p.fsm.current)
       		console.log("g.currentRound.fsm.current")
       		console.log(g.currentRound.fsm.current)
       		p.fsm = p.newTrucoFSM(g.currentRound.fsm.current);
       		p.playedCards = g.currentRound.playedCards;
        	juego.currentRound = p;
        	juego.name = g.name;
        	juego.player1=g.player1;
			juego.player2=g.player2;
			juego.currentHand= g.currentHand; 
			juego.rounds= g.rounds;
			juego.score=g.score;
        	juego.save(function(){
	        	if(err){
	        		console.log("ERROR: update - "+err)
	        	}
	        });
        });
        res.redirect("/play?idPartida="+idGame)
    });
});

module.exports = router;

