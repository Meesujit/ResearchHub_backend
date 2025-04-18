const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {        
        const {username, email, password, role} = req.body;
        
        const userExists = await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: `User already exists with email: ${email}`});
        }

        const hashedPassword = await bcrypt.hash(password, 8);
        
        const newUser = new User({username, email, password: hashedPassword, role: role || 'user'});

        await newUser.save();

        res.status(201).json({message: `User registered with username: ${username} and email: ${email}`});
        
    } catch (error) {
        res.status(500).json({message: `something went wrong ${error.message}`});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message: `User not found ${email}`});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message: `Invalid credentials`});
        }

        // if(user.role === 'user' && !user.isApproved) return res.status(403).json({message: `Admin approve is pending`});
        // if(!user.isApproved) return res.status(403).json({message: `Admin approve is pending`});
        
        const token = jwt.sign(
            {
                _id: user._id,
                role: user.role,
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRE
            });
        

            res.status(200).json({
                message: `User logged in with email: ${email}`,
                _id: user._id,
                role: user.role,
                token: token,
                username: user.username,
                email: user.email,

    });
        
    } catch (error) {
        res.status(500).json({message: `something went wrong ${error.message}, Server Error`});
    }
}

const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: `User logged out`});
}

module.exports = {
    register,
    login,
    logout,
}