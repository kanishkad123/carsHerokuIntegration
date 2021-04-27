const express = require('express');
const {check, validationResult} = require('express-validator/check');
// const uuid = require('uuid');

// let todoList = require("../data/todo");

let Note = require("../../models/Note");
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const note = await Note.find();
        res.send(note);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id', async(req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send('task not found');
        }
        res.send(note);
    } catch (err) {
        res.status(500).send('Server error');
    }
});


router.post('/', 
auth,
[
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),  
     
  ],

async(req, res) => {
    console.log("Sandeep3 printing inside post block");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    else{
    try {
        const newNote = new Note({    
            user:req.user.id,    
            title: req.body.title,
            description: req.body.description,
            date:req.body.date,
            tagData:req.body.tags,
        });
       
        console.log("tagcontent"+req.body.tags);
        const result = await newNote.save();
        console.log("Mandy"+result);
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
}
})


router.delete('/', 
auth,
async(req, res) => {
    try {
      
        const note = await Note.findById(req.body.id);
        
        if (!note) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        if (req.user.id != note.user) {
            return res
                .status(404)
                .send("User can not delete other user's note");
        }
        const result = await Note.findByIdAndDelete(req.body.id)
        res.send(result);

    } catch (err) {
        res.status(500).send('Server error');
    }

})


router.put('/', 
auth,
[
    check('title', 'Title is required').not().isEmpty(),
    check('description','Description is required').not().isEmpty(),    
],
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    if (req.user.id != note.user) {
        return res
            .status(404)
            .send("User can not update other user's note");
    }
    else{
    try {
        const note = await Note.findById(req.body.id);
        if (!note) {
            return res.status(404).json({ msg: 'Task not found' });
        }
        note.title = req.body.title;
        note.description = req.body.description; 
        note.tagData = req.body.tags;
        await note.save();
        res.send(note);
    } catch (err) {
        res.status(500).send('Server error');
    }
}
});

module.exports = router;