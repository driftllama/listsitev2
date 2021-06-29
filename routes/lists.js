var express = require('express');
var router = express.Router({mergeParams : true});
var passport = require('passport');

var User = require("../models/user");
var List = require("../models/list");

router.get("/mylists", isLoggedIn, function(req, res){
	var id = req.user.id;
	var username = req.user.username;
	List.find().where("author._id").equals(req.user.id).exec(function(err, foundLists){
		if (err) {
			res.redirect("/");
		}
		else {
			res.render("./lists/mylist", {lists : foundLists});
		}
	});
});

router.post("/newList", isLoggedIn, function(req, res){
	List.create(req.body.list, function(err, newList){
		if(err) {
			res.redirect("/");
		}
		else {
			console.log(newList);
			newList.author._id = req.user.id;
			newList.author.username = req.user.username;
			newList.elements = [];
			newList.save();
			res.redirect("/mylists");
		}
	});
});

router.post("/:lid/newElement", isLoggedIn, function(req, res){
	List.findById(req.params.lid, function(err, foundList){
		if(err) {
			res.redirect("/");
		}
		else {
			var year = parseInt(req.body.duedate.substring(0, 4));
			var month = parseInt(req.body.duedate.substring(5, 7));
			var monthforpushing = month - 1;
			var day = parseInt(req.body.duedate.substring(8, 10));
			var dateofdue = new Date(year, monthforpushing, day);
			var monthdays = 0;
			for (var i = 0; i < month; i++) {
				monthdays = monthdays + parseInt(daysInMonth(i, year));
			}
			var total = monthdays + year * 365 + day;
			console.log(foundList);
			var objectforpush = {
				title : req.body.element,
				duedate : dateofdue,
				dayssince0000 : total
			}
			console.log(objectforpush);
			console.log(total);
			foundList.elements.push(objectforpush);
			foundList.save();
			console.log(foundList);
			res.redirect("/mylists");
		}
	})
})

router.delete("/:lid/deleteList", isLoggedIn, function(req, res){
	List.findByIdAndRemove(req.params.lid, function(err){
		if(err) {
			res.redirect("/");
		}
		else {
			res.redirect("/mylists");
		}
	})
});

router.delete("/:lid/deleteElement/:index", isLoggedIn, function(req, res){
	List.findById(req.params.lid, function(err, foundList){
		if(err) {
			res.redirect("/");
		}
		else {
			foundList.elements.splice(parseInt(req.params.index), 1);
			foundList.save();
			res.redirect("/mylists");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};

function daysInMonth (month, year) { 
    return new Date(year, month, 0).getDate(); 
} 

module.exports = router;