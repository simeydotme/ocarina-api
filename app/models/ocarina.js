
// app/models/ocarina.js

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SongSchema = new Schema({

    name: { type: String, default: "Unnamed Song" },
    title: String,
    tabs: [],
    created: { type: Date, default: Date.now }

});

module.exports = mongoose.model("songs", SongSchema);