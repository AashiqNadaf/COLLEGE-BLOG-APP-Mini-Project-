var mongoose = require("mongoose");

var studentSchema = new mongoose.Schema({
    firstName: String,
    noCaps: String,
    lastName: String,
    fatherName: String,
    motherName: String,
    yearOfJoining: String,
    procName: String,
    created: {type: Date, default: Date.now},
    proctor: {
        id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
        },
        username: String
    },
    isFeePaid: {type: Boolean, default: false}
});
module.exports = mongoose.model("Student", studentSchema);