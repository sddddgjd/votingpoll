var mongoose = require('mongoose');

//poll schema
var pollSchema = mongoose.Schema({
    name : String,
    options : Array,
    votes: Array,
    created: {type: Date, default:Date.now}
});

module.exports = mongoose.model('Poll', pollSchema);