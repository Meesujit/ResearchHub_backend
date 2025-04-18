const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes');
const researchRoutes = require('./routes/researchRoutes')
const eventRoutes = require('./routes/eventRoutes');
const app = express();
connectDB();


//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:4000",
    credentials: true,
}));


//Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Auth API');
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/research',researchRoutes);
app.use('/api/event',eventRoutes);

// Server Start.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));