const express = require('express');

let JobApplications = require('../../models/JobApplications');

const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const jobsDb = await JobApplications.find();
    res.send(jobsDb);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const application = await JobApplications.findById(req.params.id);
    if (!application) {
      return res.status(404).send('Application not found');
    }
    res.send(application);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.post('/',
  auth,
  [check('organization').not().isEmpty(), check('date').not().isEmpty(), check('attachment').isLength({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newApplication = new JobApplications({
        organization: req.body.organization,
        date: req.body.date,
        attachment: req.body.attachment,
      });
      const result = await newApplication.save();
      res.send(result);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

router.delete('/', auth, [check('id','ID field is required').not().isEmpty()], 
async (req, res) => {
  try {
    const application = await JobApplications.findById(req.body.id);
    if (!application) {
      return res.status(404).json({ msg: 'Application not found' });
    }
    const result = await JobApplications.findByIdAndDelete({ _id: req.body.id });
    res.send(result);
  } catch (err) {
    res.status(500).send('server error');
  }
});

router.put('/',
  auth,
  [check('id','ID field is required').not().isEmpty(), check('organization').not().isEmpty(), check('date').not().isEmpty(), check('attachment').isLength({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const application = await JobApplications.findById(req.body.id);
      if (!application) {
        return res.status(404).json({ msg: 'Job application not found' });
      }

      application.organization = req.body.organization;
      application.date = req.body.date;
      application.attachment = req.body.attachment;
      await application.save();
      res.send(application);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
