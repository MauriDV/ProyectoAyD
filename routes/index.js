var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var mongoose = require('mongoose');
var Player = require('../models/player').player
var Game = require('../models/game').game
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

router.get('/createNewGame/:user', function(req,res) {
    var name = req.params.user;
    res.render('newGame',{user:name}); 
});

router.post('/createNewGame/:user', function(req,res) {
    var jugador1 = new Player({name:req.params.user});
    var jugador2 = new Player({name:req.body.p2});
    jugador1.save();
    jugador2.save();
    var game = new Game({name:req.body.nGame,player1:jugador1,player2:jugador2,currentHand:jugador1})
    game.save(function(err,g) {
        console.log(g._id);
        res.redirect('/play/'+g._id);
    })
})

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.get('/play/:game',function(req,res){
    var query = Game.findOne({_id:req.params.game});
    query.exec(function(err, game) {
        if (err) return handleError(err);

        var p1 = new Player(game.player1);
        var p2 = new Player(game.player2);
        g = new Game({name:game.name,player1:p1,player2:p2,currentHand:p1});
        g.newRound();
        res.render("play",{juego:g});
    });
});


module.exports = router;

