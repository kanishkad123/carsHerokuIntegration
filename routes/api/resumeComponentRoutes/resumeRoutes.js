const express = require('express');
const { check, validationResult } = require('express-validator');
let Resume = require('../../../models/Resume');

const authToken = require('../../../middleware/auth');



const router = express.Router();

//print list of resumes using get method
router.get('/',authToken,async (req, res) =>
{try{
    //const resumeList = await Resume.find({ user:req.user.id });
    const resumeList = await Resume.find();
     
    res.send(resumeList);
} catch(err)
{
    res.status(500).send('server error in get');
}
}
);

//find resume by id using get method
router.get('/:id',check('id', 'id is required').not().isEmpty(), async(req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
const resumeDetail = await Resume.findById(req.params.id)
if(!resumeDetail)
{
    return res.status(404).send('record not found');
}

    res.send(resumeDetail);
} catch(err)
{
    res.status(500).send('server erroe');
}
}
);

//post method to add data in the Resume
router.post('/',authToken,[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty().isEmail().withMessage('Must be a valid email'),
    check('phone','Phone is required').not().isEmpty(),
    // check('linkedin').isURL().withMessage('Must be a valid LinkedIn URL'),
    // check('github').isURL().withMessage('Must be a valid Github URL'),
    check('skills', 'Skill field is required').not().isEmpty(),
    check('exp1_org', 'Organization experience 1 field is required').not().isEmpty(),
    check('exp1_pos', 'Organization position 1 field is required').not().isEmpty(),
    check('exp1_desc', 'Organization responisbility 1 field is required').not().isEmpty(),
    check('exp1_dur', 'Organization experience duration 1 field is required').not().isEmpty(),
    check('exp2_org', 'Organization experience 2 field is required').not().isEmpty(),
    check('exp2_pos', 'Organization position 2 field is required').not().isEmpty(),
    check('exp2_desc', 'Organization responisbility 2 field is required').not().isEmpty(),
    check('exp2_dur', 'Organization experience duration 2 field is required').not().isEmpty(),
    check('proj1_title', 'Project title 1 is required').not().isEmpty(),
    check('proj1_desc', 'Project description 1 is required').not().isEmpty(),
    check('proj2_title', 'Project title 2 is required').not().isEmpty(),
    check('proj2_desc', 'Project description 2 is required').not().isEmpty(),
    check('edu1_school', 'Education 1 is required').not().isEmpty(),
    check('edu1_year', 'Education year 1 is required').not().isEmpty(),
    check('edu1_qualification', 'Education Qualification 1 is required').not().isEmpty(),
    check('edu1_desc', 'Education description 1 is required').not().isEmpty(),
   
],async (req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const newResumeRecord = new Resume;
    newResumeRecord.name= req.body.name;
    newResumeRecord.email= req.body.email;
    newResumeRecord.phone= req.body.phone;
    newResumeRecord.linkedin=req.body.linkedin;
    newResumeRecord.github= req.body.github;
    newResumeRecord.skills= req.body.skills;

    newResumeRecord.experience.push(
        {
            organization:req.body.exp1_org,
            position:req.body.exp1_pos,
            description:req.body.exp1_desc,
            duration:req.body.exp1_dur
        },
        {
            organization:req.body.exp2_org,
            position:req.body.exp2_pos,
            description:req.body.exp2_desc,
            duration:req.body.exp2_dur
        });
    


    newResumeRecord.project.push(
        {
            title:req.body.proj1_title,
            link:req.body.proj1_link,
            description:req.body.proj1_desc
               
        },
        {
            title:req.body.proj2_title,
            link:req.body.proj2_link,
            description:req.body.proj2_desc
        });

    

    newResumeRecord.education.push(
        {
            school:req.body.edu1_school,
            year:req.body.edu1_year,
            qualification:req.body.edu1_qualification,
            description:req.body.edu1_desc
                       
        },
        {
            school:req.body.edu2_school,
            year:req.body.edu2_year,
            qualification:req.body.edu2_qualification,
            description:req.body.edu2_desc
        });
    
    newResumeRecord.extra.push(
        {
            title:req.body.extra_1
        },
        {
            title:req.body.extra_2
        },
        {
            title:req.body.extra_3
        },
        {
            title:req.body.extra_4
        },
        {
            title:req.body.extra_5
        },
        );
    
    newResumeRecord.user=req.user.id;

const result = await newResumeRecord.save();


    res.send(result);
} catch(err)
{
    res.status(500).send('server erroe');
}
}
);

//delete project record using delete
router.delete('/',authToken,check('id', 'id is required').not().isEmpty(),async (req, res) =>
{try{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const resumeDetail = await Resume.findById(req.body.id).exec()
    if(!resumeDetail)
    {
        return res.status(404).send('record not found');
    }
    if (req.user.id != resumeDetail.user._id) {
        return res
            .status(404)
            .send("user can not delete other user's resume");
    }

    const resumeList = await Resume.findByIdAndDelete(req.body.id);
    
        res.send(resumeList);
} catch(err)
{
    res.status(500).send('server erroe');
}
}
);
//update project record using put
router.put('/',authToken,[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty().isEmail().withMessage('Must be a valid email'),
    check('phone','Phone is required').not().isEmpty(),
    // check('linkedin').isURL().withMessage('Must be a valid LinkedIn URL'),
    // check('github').isURL().withMessage('Must be a valid Github URL'),
    check('skills', 'Skill field is required').not().isEmpty(),
    check('exp1_org', 'Organization experience 1 field is required').not().isEmpty(),
    check('exp1_pos', 'Organization position 1 field is required').not().isEmpty(),
    check('exp1_desc', 'Organization responisbility 1 field is required').not().isEmpty(),
    check('exp1_dur', 'Organization experience duration 1 field is required').not().isEmpty(),
    check('exp2_org', 'Organization experience 2 field is required').not().isEmpty(),
    check('exp2_pos', 'Organization position 2 field is required').not().isEmpty(),
    check('exp2_desc', 'Organization responisbility 2 field is required').not().isEmpty(),
    check('exp2_dur', 'Organization experience duration 2 field is required').not().isEmpty(),
    check('proj1_title', 'Project title 1 is required').not().isEmpty(),
    check('proj1_desc', 'Project description 1 is required').not().isEmpty(),
    check('proj2_title', 'Project title 2 is required').not().isEmpty(),
    check('proj2_desc', 'Project description 2 is required').not().isEmpty(),
    check('edu1_school', 'Education 1 is required').not().isEmpty(),
    check('edu1_year', 'Education year 1 is required').not().isEmpty(),
    check('edu1_qualification', 'Education Qualification 1 is required').not().isEmpty(),
    check('edu1_desc', 'Education description 1 is required').not().isEmpty(),
    check('id', 'Id is required').not().isEmpty(),
], async(req, res) =>
{try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const resumeDetail = await Resume.findById(req.body.id)
    if(!resumeDetail)
{
    return res.status(404).send('record not found');
}


const filter = { _id: req.body.id };
const update = { 
       name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    linkedin:req.body.linkedin,
    github: req.body.github,
    skills: req.body.skills,
    experience:[
        {
            organization:req.body.exp1_org,
            position:req.body.exp1_pos,
            description:req.body.exp1_desc,
            duration:req.body.exp1_dur
        },
        {
            organization:req.body.exp2_org,
            position:req.body.exp2_pos,
            description:req.body.exp2_desc,
            duration:req.body.exp2_dur
          } 
      ],
    project:[
        {
            title:req.body.proj1_title,
            link:req.body.proj1_link,
            description:req.body.proj1_desc
               
        },
        {
            title:req.body.proj2_title,
            link:req.body.proj2_link,
            description:req.body.proj2_desc
        }
      ],
    education:[
        {
            school:req.body.edu1_school,
            year:req.body.edu1_year,
            qualification:req.body.edu1_qualification,
            description:req.body.edu1_desc
                       
        },
        {
            school:req.body.edu2_school,
            year:req.body.edu2_year,
            qualification:req.body.edu2_qualification,
            description:req.body.edu2_desc
        }
      ],
    extra:[
        {
          title:req.body.extra_1
        },
        {
            title:req.body.extra_2
          }
          ,
          {
            title:req.body.extra_3
          },
          {
            title:req.body.extra_4
          },
          {
            title:req.body.extra_5
          }
      ],
    user:req.user.id
 };

// `doc` is the document _after_ `update` was applied because of
// `new: true`
let doc = await Resume.findOneAndUpdate(filter, update, {
  new: true
});

//await resumeDetail.save();

    res.send(doc);
} catch(err)
{
    res.status(500).send('server error');
}
}
);

module.exports = router;