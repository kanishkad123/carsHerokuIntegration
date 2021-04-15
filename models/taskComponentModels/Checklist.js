const mongoose = require("mongoose");

//schema
const ChecklistSchema = new mongoose.Schema({
	card: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "card",
	},
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "todo",
		},
	],
	checklistName: {
		type: String,
		//required: true,
	},
});

module.exports = mongoose.model("Checklist", ChecklistSchema);
