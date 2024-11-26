const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config();


const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;



exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    try {
      const existingUser = await User.findOne({ email });
      res.json(existingUser);

      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Signup successful!' });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }

}




exports.login = async (req, res) => {
  const { email, password, isAdmin } = req.body;

  try {
    if (isAdmin) {
      // Admin login
      if (email !== ADMIN_EMAIL) {
        return res.status(404).json({ error: "Admin not found!" });
      }

      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: "Invalid admin credentials!" });
      }

      const token = jwt.sign(
        { id: "admin", email, isAdmin: true },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({ token, isAdmin: true });
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: false },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, isAdmin: false, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized!" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = decoded.isAdmin
      ? { email: ADMIN_EMAIL, name: "Admin", role: "admin" }
      : await User.findById(decoded.id);

    if (!user) return res.status(404).json({ error: 'User not found!' });

    res.json({ user });

  } catch (error) {
    res.status(401).json({ error: "Unauthorized!" });
  }
};

