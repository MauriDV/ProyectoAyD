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

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user : req.user});
});

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

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/createNewGame', function(req,res) {
    res.render('newGame'); 
});

router.post('/createNewGame', function(req,res) {
    var jugador1 = new Player({name:req.body.you});
    var jugador2 = new Player({name:req.body.oponente});
    jugador1.save(function(err,p1){
        if (err){
            console.log("ERROR j1: "+err);
        }
        jugador2.save(function(err,p2) {
            if (err){
                console.log("ERROR j2: "+err);
            }
            var game = new Game({
                name : req.body.nGame,
                player1 : p1,
                player2 : p2,
                currentHand : p1
            });
            game.save(function (err,g) {
                if (err){
                    console.log("ERROR: "+err);
                }
                res.redirect('/newRound?gId='+g._id);
            });
        });
    });
})

router.get('/newRound', function(req, res){
    var juego = Game.findOne({_id:req.query.gId},function(err,game){
        if (err){
            console.log("ERROR: "+err);
        }
        game.newRound();
        console.log("Jugador 1: "+game.player1.getName());
        console.log("Jugador 2: "+game.player2.getName());
        console.log("CurrentHand: "+game.currentHand.getName());
        console.log("CurrentRound: "+game.currentRound);
        console.log("ID del game: "+game._id);
        res.redirect("/play?gId="+game._id);
    })
});

router.get('/play',function(req,res){
    var juego = Game.findOne({_id:req.query.gId},function(err,game){
        if (err){
            console.log("ERROR: "+err);
        }
        console.log("Jugador 1: "+game.player1.getName());
        console.log("Jugador 2: "+game.player2.getName());
        console.log("CurrentHand: "+game.currentHand.getName()); 
        console.log("CurrentRound: "+game.currentRound);   // CURRENTROUND ES UNDEFINED
        console.log("ID del game: "+game._id);
        res.render("play",{juego:game});
    })
});

router.post('/play',function(req,res){
    var juego=Game.findOne({_id:req.body.idPartida},function(err,game) {
        var estado=req.body.action;
        console.log(estado);
        res.redirect("/play?gId="+game._id)
    });
});

module.exports = router;

