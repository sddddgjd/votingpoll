var mongoose = require('mongoose');

//poll schema
var pollSchema = mongoose.Schema({
    name : String,
    options : [{}],
    creator: String,
    voters: Array,
    created: {type: Date, default:Date.now}
});

pollSchema.methods.update = function(){
    var poll = this, s = 0;
    this.options.forEach(function(option){
        s += option.votes;
    });
    this.options.forEach(function(option){
       option.perc = option.votes / s * 100; 
    });
    this.markModified('options');
    this.save(function(err){
        if(err)
            console.log(err);
    })
}

module.exports = mongoose.model('Poll', pollSchema);