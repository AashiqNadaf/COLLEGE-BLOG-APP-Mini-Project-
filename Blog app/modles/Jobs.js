var mongoose = require("mongoose");

var jobSchema = new mongoose.Schema({
    company: String,
    branch: String,
    reqr: String,
    image: String,
    date: String,
	description: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
module.exports = mongoose.model("Job", jobSchema);