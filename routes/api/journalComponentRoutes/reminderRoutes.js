const express = require('express');
const { check, validationResult } = require('express-validator');
<<<<<<< Updated upstream
let Reminder = require('../../../models/Reminder');
=======
let Reminder = require('../../../models/journalComponentModels/Reminder');
>>>>>>> Stashed changes

const authToken = require('../../../middleware/auth');

const router = express.Router();

//print list of Reminder using get method
router.get('/',authToken,async (req, res) =>
{   
    try{
    //const reminderList = await Reminder.find({ user:req.user.id });
    const reminderList = await Reminder.find();
     
    res.send(reminderList);
} catch(err)
{
    res.status(500).send('server error in get');
}
}
);

//find reminder by id using get method
router.get('/:id',check('id', 'id is required').not().isEmpty(), async(req, res) =>
{try
    {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
const reminderList = await Reminder.findById(req.params.id)
if(!reminderList)
{
    return res.status(404).send('record not found');
}
    res.send(reminderList);
} catch(err)
{
    res.status(500).send('server error');
}
}
);

//post method to add data in the reminder
router.post('/',authToken,[
    check('name', 'name is required').not().isEmpty(),
    check('startDate', 'startDate is required').not().isEmpty(),
    check('endDate', 'endDate is required').not().isEmpty()
    
],async (req, res) =>
{try{
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const newReminderRecord = new Reminder;
  
    newReminderRecord.name= req.body.name;
    newReminderRecord.startDate= req.body.startDate;
    newReminderRecord.endDate= req.body.endDate;

const result = await newReminderRecord.save();

    res.send(result);
} catch(err)
{
    res.status(500).send('server error');
}
}
);

router.delete('/', authToken, [check('id','ID field is required').not().isEmpty()], 
async (req, res) => {
  try {
    const reminderDetail = await Reminder.findById(req.body.id);
    if (!reminderDetail) {
      return res.status(404).json({ msg: 'Reminder with this ID is not found' });
    }
    const reminderList = await Reminder.findByIdAndDelete({ _id: req.body.id });
    return res.status(404).json({ msg: 'This ID reminder Record is Deleted' });
    res.send(reminderList);
  } catch (err) {
    res.status(500).send('server error');
  }
});


//update project record using put
router.put('/',authToken,[
    check('name', 'name is required').not().isEmpty()

], async(req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const reminderList = await Reminder.findById(req.body.id)
    if(!reminderList)
{
    return res.status(404).send('record not found');
}

const filter = { _id: req.body.id };
const update = { 
    title: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate
 };
 
 return res.status(404).send('This reminder record is UPDATED');

let doc = await Reminder.findOneAndUpdate(filter, update, {
  new: true
});

//await reminder save();

    res.send(doc);
} catch(err)
{
    res.status(500).send('server error');
}
}
);

module.exports = router;