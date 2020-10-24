const express = require('express');
const auth = require('../routes/authRoute');
const users = require('../routes/usersRoute');
const error = require('../middleware/errorMiddleware');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(error);
}