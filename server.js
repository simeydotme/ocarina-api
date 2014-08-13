
// server.js

var express = require("express");
var app = express();
var bodyParser = require("body-parser");


var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ocarina");


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
var port = process.env.PORT || 8888;

var Song = require("./app/models/ocarina");



var router = express.Router();


// middleware to use for all requests
router.use(function(req, res, next) {

    console.log("Router intercept...");
    next();

});


// test route
router.get("/", function(req, res) {
    res.json({ message: "My own cocksucking API!" });
});

router.route("/songs")

    .post(function(req, res) {

        var song = new Song();

        song.name = req.body.name;
        song.title = req.body.title;
        song.tabs = req.body.tabs;

        song.save(function(err) {

            var message = "Song \""+ song.name +"\" was created!";

            if (err) { res.send(err); } 
            else {
                res.json({ message: message });
                console.log( message );
            }

        });
        
    })

    .get(function(req, res) {

        Song.find(function(err, songs) {

            if (err) {
                res.send(err);
            } else {
                res.json(songs);
            }

        });

    });


router.route("/songs/:song_id")

    .get(function( req, res ) {

        Song.findById( req.params.song_id, function( err, song ) {

            if ( err ) {
                res.send( err );
            } else {
                res.json( song );
            }

        });

    })

    .put(function( req, res ) {

        Song.findById( req.params.song_id, function( err, song ) {

            if( err ) {
                res.send( err );
            } else {

                song.name = req.body.name;
                song.save( function(err) {

                    if( err ) {
                        res.send( err );
                    } else {
                        res.json({ message: "Song \""+ song.name +"\" has been updated!" });
                    }

                });
            }

        });

    })

    .delete(function( req, res ) {

        var songName;
        Song.findById( req.params.song_id, function( err, song ) {

            if( err ) {
                res.send( err );
            } else {

                if( song ) {
                    songName = song.name;
                }

            }

        });

        Song.remove({ _id: req.params.song_id }, function( err, song ) {

            if( err ) {
                res.send( err );
            } else {
                res.json({ message: "Song \""+ songName +"\" was deleted" });
            }

        });

    });



// register routes
app.use("/api", router);




// start web server

app.listen(port);
console.log("API Running on Port " + port);
