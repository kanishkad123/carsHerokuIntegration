const express = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
let Users = require('../../models/User');

const auth = require('../../middleware/auth');

// Get all users
router.get('/', async (req, res) => {
    try {
        const userDb = await Users.find();
        res.send(userDb);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Get user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Create new user
router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please enter valid email').isEmail(),
        check('password', 'please enter password with 3 or more').isLength({
            min: 3,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        try {
            const hashpass = await bcrypt.hash(req.body.password, 12);
            const newUser = new Users({
                name: req.body.name,
                email: req.body.email,
                password: hashpass,
            });
            await newUser.save();
            //res.send(newUser);
            const payload = {
                user: {
                    id: newUser.id,
                    name: newUser.name,
                },
            };

              jwt.sign(
                payload,
                config.get('jwtsecret'),
                { expiresIn: '1h' },
                (err, token) => {
                  if (err) throw err;
                  res.json({ token });
                }
              );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
);

// Delete User
router.delete('/',auth, async (req, res) => {
    try {
        const user = await Users.findById(req.body.id);
        if (!user) {
            return res.status(404).json({ msg: 'user not found' });
        }
        const result = await Users.findByIdAndDelete({ _id: req.body.id });
        res.send(result);
    } catch (err) {
        res.status(500).send('server error');
    }
});

// Update User
router.put('/',
    auth,
    [check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'please enter password with 3 or more').isLength({
        min: 3,
    })],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const user = await Users.findById(req.body.id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }
            const hashpass = await bcrypt.hash(req.body.password, 12);
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = hashpass;
            await user.save();
            res.send(user);
        } catch (err) {
            console.log(err);
            res.status(500).send('Server error');
        }
    });

module.exports = router;