var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
	title: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    image6: String,
    image7: String,
    image8: String,
    image9: String,
    image10: String,
    description: String,
    teamMembers: String,
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
module.exports = mongoose.model("Project", projectSchema);