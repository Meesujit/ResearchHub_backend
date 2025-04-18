const express = require('express');
const router = express.Router();

const authorizeRole = require('../middlewares/roleMiddleware');
const verifyToken = require('../middlewares/authMiddleware');

// ✅ Only Admin can access this route
router.get('/admin', verifyToken, authorizeRole("admin"), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

// ✅ Both Admin and User can access this route, but they must be authenticated
router.get('/user', verifyToken, authorizeRole("admin", "user"), (req, res) => {
    res.json({ message: 'Welcome User' });
});

// ✅ Logout should check if the user is logged in first
router.post('/logout', verifyToken, (req, res) => {
    res.clearCookie('token'); // Clear the authentication token
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;
