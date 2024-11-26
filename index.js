const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const path = require('path')
const researchPaperRoutes = require('./routes/researchPaperRoutes')

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);

app.use('/upload', express.static(path.join(__dirname, '/uploads')));

app.use('/api/research-papers',researchPaperRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));