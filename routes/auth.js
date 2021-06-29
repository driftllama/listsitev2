var express = require('express');
var router = express.Router({mergeParams : true});
var passport = require('passport');

var User = require("../models/user");
var List = require("../models/list");

router.get('/register', function(req, res){
	res.render('auth/register');
});

router.post("/register", function(req, res){
	console.log(req.body.dob);
	var newUser = new User({username : req.body.username, dob : req.body.dob, fname : req.body.fname, lname : req.body.lname, email : req.body.email})
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.render("auth/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/dashboard");
		});
	});
});

router.get("/login", function(req, res){
	res.render("auth/login");
});

router.post("/login", passport.authenticate("local", 
	{
		successRedirect : "/dashboard",
		failureRedirect : "/login"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

module.exports = router;