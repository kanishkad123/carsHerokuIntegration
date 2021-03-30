const express = require('express');

let Cars = require('../../models/Cars');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const carDb = await Cars.find();
    res.send(carDb);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const car = await Cars.findById(req.params.id);
    if (!car) {
      return res.status(404).send('Car not found');
    }
    res.send(car);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/',
  auth,
  [check('make').not().isEmpty(), check('model').isLength({ min: 2 }), check('year').isLength({ min: 4, max: 4 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newCar = new Cars({
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
      });
      const result = await newCar.save();
      res.send(result);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

router.delete('/',auth, async (req, res) => {
  try {
    const car = await Cars.findById(req.body.id);
    if (!car) {
      return res.status(404).json({ msg: 'Car not found' });
    }
    const result = await Cars.findByIdAndDelete({ _id: req.body.id });
    res.send(result);
  } catch (err) {
    res.status(500).send('server error');
  }
});

router.put('/',
  auth,
  [check('make').not().isEmpty(), check('model').isLength({ min: 2 }), check('year').isLength({ min: 4, max: 4 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const car = await Cars.findById(req.body.id);
      if (!car) {
        return res.status(404).json({ msg: 'Car not found' });
      }

      car.make = req.body.make;
      car.model = req.body.model;
      car.year = req.body.year;
      await car.save();
      res.send(car);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
