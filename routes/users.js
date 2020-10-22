const express = require('express');
const router = express.Router();

const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const { User, validate } = require('../models/user');
const logger = require('../middleware/logger');


// GET - GET USER INFO
router.get('/me', auth, async (req, res) => {
    const user = await (await User.findById(req.user._id).select('-password'));
    res.send(user);
});


// POST - REGISTER NEW USER
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already exists with this email.');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email'])); // send token in HTML header so that it can be read by client and kept logged in
});

module.exports = router;