const express = require("express");
const { check, validationResult } = require("express-validator");
let Checklist = require("../../../models/taskComponentModels/Checklist");
let Card = require("../../../models/taskComponentModels/Card");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const ChecklistDb = await Checklist.find();
		res.send(ChecklistDb);
	} catch (err) {
		res.status(500).send("Server error");
		console.log(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const g = await Checklist.findById(req.params.id);
		if (!g) {
			return res.status(404).send("Checklist not found");
		}
		res.send(g);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

router.post(
	"/",
	// [
	// 	check("make", "make is required").not().isEmpty(),
	// 	check("model", "model longer than 1 char").isLength({
	// 		min: 1,
	// 	}),
	// 	check("year", "year is required").not().isEmpty(),
	// ],

	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			const card = await Card.findById(req.body.cardId);
			const checklist = new Checklist({
				todos: [],
				checklistName: req.body.checklistName,
			});
			card.checklists = [...card.checklists, checklist];
			await checklist.save();
			const result = await card.save();
			res.send(result);
		} catch (err) {
			res.status(500).send("Server error");
		}
	}
);

// router.delete("/", async (req, res) => {
// 	try {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(422).json({ errors: errors.array() });
// 		}
// 		const c = await Car.findById(req.body.id);

// 		if (!c) {
// 			return res.status(404).json({ msg: "Car not found" });
// 		}
// 		const result = await Car.findByIdAndDelete({ _id: req.body.id });
// 		res.send(result);
// 	} catch (err) {
// 		res.status(500).send("server error");
// 	}
// });

// router.put(
// 	"/",
// 	[
// 		check("make", "make is required").not().isEmpty(),
// 		check("model", "model longer than 1 char").isLength({
// 			min: 1,
// 		}),
// 		check("year", "year is required").not().isEmpty(),
// 	],
// 	async (req, res) => {
// 		try {
// 			const errors = validationResult(req);
// 			if (!errors.isEmpty()) {
// 				return res.status(422).json({ errors: errors.array() });
// 			}
// 			const c = await Car.findById(req.body.id);
// 			if (!c) {
// 				return res.status(404).json({ msg: "Car not found" });
// 			}
// 			c.make = req.body.make;
// 			c.model = req.body.model;
// 			c.year = req.body.year;
// 			await c.save();
// 			res.send(c);
// 		} catch (err) {
// 			res.status(500).send("Server error");
// 		}
// 	}
// );

module.exports = router;
