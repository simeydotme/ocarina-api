
// server.js

var apiName = "Ocarina Tabs API v0.1";

var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    extend = require("extend"),
    Song = require("./app/models/ocarina");

var ports = {
    node: 8888,
    mongo: 8877
};

// connect to our mongo database
mongoose.connect("mongodb://localhost:"+ ports.mongo +"/ocarina");

// configure app to use bodyParser()
// this will let us get the data from a POST
var app = express(),
    router = express.Router();

    app.use(bodyParser());


var resWrap = function( res, status ) {

    status = status || "ok";
    
    return {
        status: status,
        response: res
    };

};


// middleware to use for all requests
router.use(function(req, res, next) {
    console.log("Router interaction");
    next();
});

// Default Route
router.get("/", function(req, res) {

    res.json(resWrap({ message: apiName }));
    console.log( apiName );

});

router.route("/songs")

    .post(function(req, res) {

        var song = new Song();

        song.name = req.body.name;
        song.title = req.body.title;
        song.tabs = req.body.tabs;

        song.save(function(err) {

            var message = "Song '"+ song.name +"' was created!";

            if (err) {
                res.send(resWrap(err,"error"));
            } else {
                res.json(resWrap({ message: message }));
                console.log( message );
            }

        });
        
    })

    .get(function(req, res) {

        Song.find(function(err, songs) {

            var message = "Getting all songs";

            if (err) {
                res.send(resWrap(err, "error"));
            } else {
                res.json(resWrap(songs));
                console.log( message );
            }

        });

    });


router.route("/songs/:song_id")

    .get(function( req, res ) {

        Song.findById( req.params.song_id, function( err, song ) {

            var message;

            if ( err ) {
                res.send(resWrap(err, "error"));
            } else {            

                message = "getting song with id: " + song._id + " and name: " + song.name;

                res.json(resWrap(song));
                console.log( message );

            }

        });

    })

    .put(function( req, res ) {

        Song.findById( req.params.song_id, function( err, song ) {
            
            var message;

            if( err ) {

                res.send(resWrap(err, "error"));

            } else {

                song.name = req.body.name;
                song.title = req.body.title;
                song.tabs = req.body.tabs;
                song.save( function(err) {

                    message = "Song '"+ song.name +"' has been updated!";
                    
                    if( err ) {
                        res.send(resWrap(err, "error"));
                    } else {
                        res.json(resWrap({ message: message }));
                        console.log( message );
                    }

                });
            }

        });

    })

    .delete(function( req, res ) {

        var songName, message;

        Song.findById( req.params.song_id, function( err, song ) {
            
            if( err ) {
                res.send(resWrap(err, "error"));
            } else if( song ) {
                songName = song.name;
            }

        });

        Song.remove({ _id: req.params.song_id }, function( err, song ) {
            
            message = "Song '"+ songName +"' was deleted";

            if( err ) {
                res.send(resWrap(err, "error"));
            } else {
                res.json(resWrap({ message: message }));
            }

        });

    });



// register routes
app.use("/", router);




// start web server

app.listen( ports.node );
console.log(" --------------------------------- ");
console.log(" - " + apiName );
console.log(" - Running on port [[ " + ports.node + " ]]" );
console.log(" --------------------------------- ");