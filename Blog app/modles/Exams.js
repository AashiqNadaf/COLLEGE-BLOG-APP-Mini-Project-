var mongoose = require("mongoose");

var examSchema = new mongoose.Schema({
	typeOfExam: String,
    sub1: String,
    date1: String,
    sub2: String,
    date2: String,
    sub3: String,
    date3: String,
    sub4: String,
    date4: String,
    sub5: String,
    date5: String,
    sub6: String,
    date6: String,
    sub7: String,
    date7: String,
    sub8: String,
    date8: String,
    sub9: String,
    date9: String,
    sub10: String,
    date10: String,
    sub11: String,
    date11: String,
    sub12: String,
    date12: String,
    sem: String,
    branch: String,
	created: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});
module.exports = mongoose.model("Exam", examSchema);