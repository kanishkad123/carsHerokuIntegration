const mongoose = require("mongoose");

//schema
const GroupSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	cards: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "card",
		},
	],
	groupName: {
		type: String,
		//required: true,
	},
});

module.exports = mongoose.model("Group", GroupSchema);
