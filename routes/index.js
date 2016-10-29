var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var mongoose = require('mongoose');
var Player = require('../models/player').player
var Deck = require('../models/deck').deck
var Card = require('../models/card').card
var Round = require('../models/card').round
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
    var jugador1 = new Player({name:req.session.passport.user});
    var jugador2 = new Player({name:null});
    g = new Game(jugador1,jugador2);
    g.newRound();
    g.currentRound.dealCards();
    res.redirect("/play");
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

    if(g==undefined){
        res.redirect('/');
    }
    if(g.player2.name==null){
        if(req.session.passport.user!=g.player1.getName()){
            g.player2.name = req.session.passport.user;
        }
    }
    res.render("play",{juego:g,us:req.session.passport.user,p1:g.player1.getName(),p2:g.player2.getName()});
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
    var estado=req.body.action;
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
        g.play(g.currentRound.currentTurn,"playCard",g.currentRound.currentTurn.card1)
    }
    if (estado=="Jugar Carta #2"){
        g.play(g.currentRound.currentTurn,"playCard",g.currentRound.currentTurn.card2)
    }
    if (estado=="Jugar Carta #3"){
        g.play(g.currentRound.currentTurn,"playCard",g.currentRound.currentTurn.card3)
    }
    res.redirect("/play")
});

module.exports = router;

