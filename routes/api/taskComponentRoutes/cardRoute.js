const express = require("express");
const { check, validationResult } = require("express-validator");
let Card = require("../../../models/taskComponentModels/Card");
let Group = require("../../../models/taskComponentModels/Group");
const router = express.Router();

//pass group id and get all cards in this group
router.post("/", async (req, res) => {
	try {
		const ids = [req.body.groupId];
		const CardDb = Card.find()
			.where("group")
			.in(ids)
			.exec((err, records) => {
				res.send(records);
			});
	} catch (err) {
		res.status(500).send("Server error");
		console.log(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const g = await Card.findById(req.params.id);
		if (!g) {
			return res.status(404).send("Card not found");
		}
		res.send(g);
	} catch (err) {
		res.status(500).send("Server error");
	}
});

router.post(
	"/add",
	[check("value", "value is required").not().isEmpty()],

	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			const group = await Group.findById(req.body.groupId);
			const card = new Card({
				group: req.body.groupId,
				value: req.body.value,
				checklists: [],
				labels: [],
				dueDate: "",
				description: "",
				comments: [],
				cover: "",
				attachment: "",
			});
			group.cards = [...group.cards, card];
			await card.save();
			const result = await group.save();
			res.send(result);
		} catch (err) {
			res.status(500).send("Server error");
		}
	}
);

router.delete("/", async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const c = await Card.findById(req.body.id);
		const g = await Group.findById(req.body.id);
		if (!c) {
			return res.status(404).json({ msg: "Card not found" });
		}
		const result = await Card.findByIdAndRemove(
			req.body.id,
			function (err, card) {
				if (card) {
					Group.updateOne(
						{ _id: card.group._id },
						{
							$pull: { cards: req.body.id },
						}
					);
				}
			}
		);

		// const result = await Card.findByIdAndDelete({ _id: req.body.id });
		// result = await Group.cards.findByIdAndDelete({ _id: req.body.id });
		res.send(result);
	} catch (err) {
		res.status(500).send("server error");
	}
});

router.put(
	"/",
	[check("value", "value is required").not().isEmpty()],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			const c = await Card.findById(req.body.id);
			if (!c) {
				return res.status(404).json({ msg: "Card not found" });
			}
			c.value = req.body.value;
			await c.save();
			res.send(c);
		} catch (err) {
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
