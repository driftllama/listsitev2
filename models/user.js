var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	dob : String,
	fname : String,
	lname : String,
	email : String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);