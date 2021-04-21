const express = require('express');
const { check, validationResult } = require('express-validator');
let Journal = require('../../../models/journalComponentModels/Journal');

const authToken = require('../../../middleware/auth');

const router = express.Router();

//print list of Journal using get method
router.get('/',authToken,async (req, res) =>
{try{
    //const journalList = await Journal.find({ user:req.user.id });
    const journalList = await Journal.find();
     
    res.send(journalList);
} catch(err)
{
    res.status(500).send('server error in get');
}
}
);

//find journal by id using get method
router.get('/:id',check('id', 'id is required').not().isEmpty(), async(req, res) =>
{try
    {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
const journalDetail = await Journal.findById(req.params.id)
if(!journalDetail)
{
    return res.status(404).send('record not found');
}
    res.send(journalDetail);
} catch(err)
{
    res.status(500).send('server error');
}
}
);

//post method to add data in the journal
router.post('/',authToken,[
    check('title', 'title is required').not().isEmpty(),
    check('journal', 'journal content is required').not().isEmpty(),
    check('date', 'date is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    
],async (req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const newJournalRecord = new Journal;
  
    newJournalRecord.title= req.body.title;
    newJournalRecord.journal= req.body.journal;
    newJournalRecord.date= req.body.date;
    newJournalRecord.category=req.body.category;
    newJournalRecord.user=req.user.id;

const result = await newJournalRecord.save();

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
    const journalDetail = await Journal.findById(req.body.id);
    if (!journalDetail) {
      return res.status(404).json({ msg: 'Journal with this ID is not found' });
    }
    const journalList = await Journal.findByIdAndDelete({ _id: req.body.id });
    return res.status(404).json({ msg: 'This ID Journal Record is Deleted' });
    res.send(journalList);
  } catch (err) {
    res.status(500).send('server error');
  }
});


//update project record using put
router.put('/',authToken,[
    check('title', 'title is required').not().isEmpty(),
    check('journal', 'journal content is required').not().isEmpty(),
    check('date', 'date is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),

], async(req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const journalList = await Journal.findById(req.body.id)
    if(!journalList)
{
    return res.status(404).send('record not found');
}

const filter = { _id: req.body.id };
const update = { 
    title: req.body.title,
    journal: req.body.journal,
    date: req.body.date,
    user:req.user.id
 };
 
 return res.status(404).send('This Journal record is UPDATED');

let doc = await Journal.findOneAndUpdate(filter, update, {
  new: true
});

//await journal save();

    res.send(doc);
} catch(err)
{
    res.status(500).send('server error');
}
}
);


router.post('/upload-image', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file - uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "image") to retrieve the uploaded file
            let image = req.files.image;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            image.mv('./uploads/' + image.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: image.name,
                    mimetype: image.mimetype,
                    size: image.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});



module.exports = router;