// const express = require('express');
// const {register, login} = require('../controllers/authController');

// const router = express.Router();

// router.post('/register', register);
// router.post('/login', login);

// module.exports = router;



// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password, isAdmin } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (isAdmin) {
      await Admin.create({ name, email, password: hashedPassword });
    } else {
      await User.create({ name, email, password: hashedPassword });
    }
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) user = await Admin.findOne({ email });

    if (!user) return res.status(404).json({ error: 'User not found!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials!' });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user instanceof Admin },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized!' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = decoded.isAdmin
      ? await Admin.findById(decoded.id)
      : await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found!' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized!' });
  }
});

module.exports = router;

