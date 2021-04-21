const express = require("express");
const { check, validationResult } = require("express-validator");
let Card = require("../../../models/taskComponentModels/Card");
const router = express.Router();

//get all labels of a card
router.get("/", async (req, res) => {
	try {
		const CardDb = await Card.findById(req.body.cardId);
		console.log(req);
		res.send(CardDb.labels);
	} catch (err) {
		res.status(500).send("Server error");
		console.log(err);
	}
});

// update labels of a card
router.put("/", async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const card = await Card.findById(req.body.cardId);
		if (!card) {
			return res.status(404).json({ msg: "card not found" });
		}
		card.labels = req.body.labels;
		await card.save();
		res.send(card);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

module.exports = router;
