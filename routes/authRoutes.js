
// routes/auth.js
const express = require('express');
const { signup, login, fetchUser } = require('../controllers/authController');

const router = express.Router();


// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Get Current User
router.get('/me', fetchUser);


module.exports = router;

