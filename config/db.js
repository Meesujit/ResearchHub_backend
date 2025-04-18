const mongoose  = require('mongoose');
require('dotenv').config();


const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB ${mongoose.connection.host} ${mongoose.connection.name}`);
    }catch(error){
        console.log('Error connecting to MongoDB', error.message);
        process.exit(1);

    }
}

module.exports = connectDB;