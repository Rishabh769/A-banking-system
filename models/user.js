const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    Username: String,
    Email: String,
    Balance: Number,
});

var userModel = mongoose.model('User', userSchema);

module.exports  = userModel;


