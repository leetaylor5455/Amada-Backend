const express = require('express');
const router = express.Router();

const authContoller = require('../controllers/authController');

// POST login credentials for JWT return
router.post('/', authContoller.login_post)

module.exports = router;