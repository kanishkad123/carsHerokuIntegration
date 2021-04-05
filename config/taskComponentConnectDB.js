const mongoose = require("mongoose");
const config = require("config");

const dbcon = config.get("taskMongoDBConnection");

const taskConnectDB = async () => {
	try {
		await mongoose.connect(dbcon, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("database connected");
	} catch (err) {
		console.log("unable to connect to database");
		process.exit();
	}
};

module.exports = taskConnectDB;
