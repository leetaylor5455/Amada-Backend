const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const usersController = require('../controllers/usersController');

// GET user info 
router.get('/me', auth, usersController.current_user_get);

// POST new user
router.post('/', usersController.new_user_post);

module.exports = router;