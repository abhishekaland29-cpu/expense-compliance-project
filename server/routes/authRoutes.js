const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// This creates the URL: http://localhost:5000/api/auth/signup
router.post('/signup', authController.signup);

module.exports = router;