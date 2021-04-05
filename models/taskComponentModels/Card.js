const mongoose = require("mongoose");

//schema
const CardSchema = new mongoose.Schema({
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "group",
	},
	value: {
		type: String,
		//required: true,
	},
	checklists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "checklist",
		},
	],
	labels: [
		{
			type: String,
			//required: true,
		},
	],
	dueDate: {
		type: String,
		//required: true,
	},
	description: {
		type: String,
		//required: true,
	},
	comments: [
		{
			type: String,
			//required: true,
		},
	],
	cover: {
		type: String,
		//required: true,
	},
	attachment: {
		type: String,
		//required: true,
	},
});

module.exports = mongoose.model("Card", CardSchema);
