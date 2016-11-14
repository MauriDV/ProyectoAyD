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

var Schema = mongoose.Schema;

var matchSchema = new Schema({
  name:         String,
  j1:      String,
  j2:      String,
  score:        { type : Array , default : [0, 0] },
  state:        String,
  ganador: String
});

var Match = mongoose.model('Match', matchSchema);

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { user : req.user});
});

router.get('/testrealtime', function(req,res){
    res.render('testRealTime');
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
    var p = new Match({
        name:req.body.nGame,
        j1:jugador1.name,
        j2:null,
        score:[],
        state:'esperando oponente',
    })

    p.save(function(err,partida){
        if(err){
            console.log('ERROR GUARDANDO PARTIDA');
        }else{
            res.redirect('/configUsers?idPartida='+partida._id)
        }
    });
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

router.get('/configUsers',function(req,res){
    Match.findOne({_id:req.query.idPartida},function(err,p){
        if(p.j1 == req.session.passport.user){
            if(p.j2 == null){
                res.render("esperando");
            }else{
                res.redirect('/play');
            }
        }else{
            p.j2 = req.session.passport.user
            Match.update({_id:req.query.idPartida},{ $set:{j1:p.j1,j2:p.j2,state:"en curso"}},function(err){
                if(err){
                    console.log('ERROR ACTUALIZANDO BD');
                }else{
                    var jugador1 = new Player(p.j1);
                    var jugador2 = new Player(p.j2)
                    g = new Game(p.name,jugador1,jugador2,p._id);
                    g.newRound();
                    g.currentRound.dealCards();
                    res.redirect("/play");
                }
            });
        }
    });
})

router.get('/newRound',function(req,res) {

    g.newRound();
    g.currentRound.dealCards();
    res.redirect("/play");
})

router.get('/juegos',function(req,res){
    Match.find({state:"esperando oponente"},function(err,matchs){
        res.render('gameList',{j:matchs});
    });
});

router.get('/estadisticas',function(req,res){
    Match.find({ganador:req.session.passport.user},function(err,victorias){
        Match.find({j1:req.session.passport.user},function(err,partidas1){
            Match.find({j2:req.session.passport.user},function(err,partidas2){
                var a = victorias.length;
                var jugadas = partidas1.length + partidas2.length; 
                res.render('estadisticas',{v:a,p:jugadas});
            });
        });
    });
})

router.get('/configGame',function(req,res){
    g = null;
    res.redirect("/");
});

router.get('/play',function(req,res){

    if(g==undefined){
        res.redirect('/');
    }
    if(g.player2.name==null){
        if(req.session.passport.user!=g.player1.getName()){
            g.player2.name = req.session.passport.user;
        }
    }

    //SocketIO
    res.io.on('connection', function(socket){
      socket.on('chat message', function(msg){
        res.io.emit('chat message', msg);
      });
    });

    res.render("play",{juego:g,us:req.session.passport.user,p1:g.player1.getName(),p2:g.player2.getName()});
});

router.post('/play',function(req,res){
    var estado=req.body.action;

    console.log(estado);

    if (estado=='Proxima ronda'){
        g.newRound();
        g.currentRound.dealCards();
        res.redirect("/play");
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
    if (estado=='quieroTruco'){
        g.play(g.currentRound.currentTurn,estado);
    }
    if (estado=='noQuieroTruco'){
        g.play(g.currentRound.currentTurn,estado);
    }
    if (estado=='truco'){
        g.play(g.currentRound.currentTurn,estado)
    }
    if (estado=='reTruco'){
        g.play(g.currentRound.currentTurn,estado)
    }
    if (estado=='valeCuatro'){
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
    if(estado=="abandonar"){
        if (g.currentRound.currentTurn == g.player1){
            nombre = g.player2.name;
        }else{
            nombre = g.player1.name;
        }
        Match.update({_id:g.identificador},{$set:{score:g.score,state:"finalizada",ganador:nombre}},function(err){
            if(err){
                console.log("ERROR ACTUALIZANDO PARTIDA FINALIZADA")
            }
        });
        g.currentRound.status = "abandono"
    }
    if(g.score[0]>=15){
        Match.update({_id:g.identificador},{$set:{score:g.score,state:"finalizada",ganador:g.player1.name}},function(err){
            if(err){
                console.log("ERROR ACTUALIZANDO PARTIDA FINALIZADA")
            }
        });
    }else if(g.score[1]>=15){
        Match.update({_id:g.identificador},{$set:{score:g.score,state:"finalizada",ganador:g.player2.name}},function(err){
            if(err){
                console.log("ERROR ACTUALIZANDO PARTIDA FINALIZADA")
            }
        });
    }
    console.log(g.currentRound.esTruco);
    console.log(g.currentRound.esTruco);
    res.redirect("/play")
});

module.exports = router;

