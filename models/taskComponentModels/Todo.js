const mongoose = require("mongoose");

//schema
const TodoSchema = new mongoose.Schema({
	text: {
		type: String,
		//required: true,
	},
	finished: {
		type: Boolean,
		//required: true,
	},
});

module.exports = mongoose.model("Todo", TodoSchema);
