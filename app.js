var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var localStrategy = require('passport-local');
var methodOverride = require('method-override');
var mailer = require('nodemailer');
var scheduler = require('node-schedule');

var mainRoutes = require("./routes/main");
var authRoutes = require("./routes/auth");
var listRoutes = require("./routes/lists");

var User = require("./models/user");
var List = require("./models/list");


mongoose.connect("mongodb://localhost:27017/listsite", {useNewUrlParser : true, useUnifiedTopology : true});


app.use(require('express-session')({
	secret: "bruh",
	resave: false,
	saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended : true}));

app.set('view engine', 'ejs');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(express.static(__dirname + "/public")); 

app.use(methodOverride('_method'));

mongoose.set('useFindAndModify', false);

app.use(mainRoutes);
app.use(listRoutes);
app.use(authRoutes);

var email = mailer.createTransport({
	service: "gmail",
	auth: {
		user: "rohancoincorporated@gmail.com",
		pass: "bruhbruh"
	}
});

// var emailUsers = scheduler.scheduleJob({second : 0}, function(){
// 	console.log("doing task");
// 	var today = new Date();
// 	var month = today.getMonth() + 1;
// 	var day = today.getDate();
// 	var year = today.getFullYear();
// 	var monthdays = 0;
// 	for (var i = 0; i < month; i++) {
// 		monthdays = monthdays + parseInt(daysInMonth(i, year));
// 	}
// 	var todaytotal = monthdays + year * 365 + day;
// 	var messageArray = [];
// 	var message1 = "";
// 	User.find({}, function(err, foundUsers){
// 		if(err){}
// 		else {
// 			foundUsers.forEach(function(currUser){
// 				var p = new Promise(function(resolve, reject){
// 					List.find().where("author._id").equals(currUser._id).exec(function(err, foundLists){
// 						foundLists.forEach(function(currList){
// 							var taskstoday = [];
// 							taskstoday.push(currList.title);
// 							currList.elements.forEach(function(currElement){
// 								if(currElement.dayssince0000 == todaytotal) {
// 									taskstoday.push(currElement.title);
// 								};
// 							});
// 							messageArray.push(taskstoday);
// 						});
// 						messageArray.forEach(function(subArray){
// 							message1 += subArray[0] + "\n";
// 							for (var i = 1; i < subArray.length; i++) {
// 								message1 += "	" + subArray[i] + "\n"
// 							}
// 							var passThrough = [currUser.email, message1];
// 							resolve(passThrough);
// 						});
// 					});
// 				});
// 				p.then(function(passThrough){
// 					var userEmail = passThrough[0];
// 					var message = passThrough[1];
// 					var emailContents = {
// 						from: "rohancoincorporated@gmail.com",
// 						to: userEmail,
// 						subject: "Your lists",
// 						text: ("Tasks due today: \n" + message)
// 					};
// 					console.log(userEmail);
// 					console.log(message);
// 					email.sendMail(emailContents, function(info, error){
// 						if(error){}
// 						else {
// 							console.log("Successful: " + info.response);
// 						}
// 					});
// 				});
// 			});
// 		};
// 	});
// });

app.listen(3000, function(){
	console.log("-----------SERVER HAS STARTED-----------");
});

function daysInMonth (month, year) { 
    return new Date(year, month, 0).getDate(); 
} 