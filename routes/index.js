var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Player = require('../models/player').player
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

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.get('/play',function(req,res){
    var game = new Game();
    res.render("play",{user:req.user, games:game})
});

module.exports = router;
