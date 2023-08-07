/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT__SECRET = "Yashisagoodb$y";

var bcrypt = require('bcryptjs');
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 5 characters long').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (user) {
        res.status(500).json({ success, error: 'sorry user with the given email already exist' })
    }

    else {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            name,
            email,
            'password': secPass,
        });

        success = true;
        newUser.save()
            .then(user => {
                // res.json(user);
                const data = {
                    user: { id: user.id }
                }
                const authtoken = jwt.sign(data, JWT__SECRET);
                success = true;
                return res.json({ success, authtoken });
            })
            .catch(error => {
                console.error('Error saving user data:', error);
                res.status(500).json({ error: 'An error occurred while saving user data' });
            });
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: 'Wrong Credentials' });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, error: 'Wrong Credentials' });
        }

        const data = {
            user: { id: user.id }
        }
        const authtoken = jwt.sign(data, JWT__SECRET);
        success = true;
        res.json({ success, authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error occured' });
    }

})


router.post('/getuser', fetchuser, async (req, res) => {

    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error occured' });
    }
})
module.exports = router;