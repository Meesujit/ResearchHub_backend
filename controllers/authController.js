const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try{
        const {name, email, password} = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(400).json({message: 'User already exists'});

        // Hash Password
        const hashedPassword = await bcrypt.hash(password,10);

        //Create new User
        const user = new User({
            name,
            email,
            password: hashedPassword, 
            role
        });
        await user.save();

        res.status(201).json({message: 'User registered successfully'});
    }catch(err){
        return res.status(500).json({message: err.message});
    }

}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const user =await User.findOne({email: email});
        if(!user) return res.status(404).json({message: 'User not found'});

        // Compare the Password
        const isMatch =await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        // Create and return token
        const token = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token, role: user.role});

        res.status(200).json({message: 'Login successful'});
        
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}