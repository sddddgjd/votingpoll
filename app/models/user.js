var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//user schema

var userSchema = mongoose.Schema({
    local : {
        username : String,
        password: String
    }
});

//generate password hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//check if password is valid

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

//create model and export it
module.exports = mongoose.model('User', userSchema);