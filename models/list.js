var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
	title: String,
	elements: [
		{
			title: String,
			duedate: Date,
			dayssince0000 : Number
		}
	],
	author: {
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("List", listSchema);