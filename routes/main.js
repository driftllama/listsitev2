var express = require('express');
var router = express.Router({mergeParams : true});

var User = require("../models/user");
var List = require("../models/list");

router.get("/", function(req, res){
	res.render("./main/index");
});

router.get("/dashboard", isLoggedIn, function(req, res){
	res.render("./main/dashboard");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

module.exports = router;