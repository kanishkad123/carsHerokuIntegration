const express = require("express");
const { check, validationResult } = require("express-validator");
let Group = require("../../../models/taskComponentModels/Group");
const auth = require("../../../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const GroupDb = await Group.find();
		res.send(GroupDb);
	} catch (err) {
		res.status(500).send("Server error");
		console.log(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const g = await Group.findById(req.params.id);
		if (!g) {
			return res.status(404).send("Group not found");
		}
		res.send(g);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

router.post(
	"/",
	auth,
	[check("groupName", "groupName is required").not().isEmpty()],

	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			const group = new Group({
				user: req.user.id,
				groupName: req.body.groupName,
				cards: [],
			});
			const result = await group.save();
			res.send(result);
		} catch (err) {
			res.status(500).send("Server error");
		}
	}
);

router.delete("/", auth, async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const c = await Group.findById(req.body.id);

		if (!c) {
			return res.status(404).json({ msg: "Group not found" });
		}
		if (req.user.id != c.user._id) {
			return res
				.status(404)
				.json({ msg: "Can't delete data that is not yours" });
		}
		const result = await Group.findByIdAndDelete({ _id: req.body.id });
		res.send(result);
	} catch (err) {
		res.status(500).send("server error");
	}
});

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
