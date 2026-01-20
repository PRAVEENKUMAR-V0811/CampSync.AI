// backend/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Route Imports
const authRoutes = require('./routes/auth'); 
const questionPaperRoutes = require('./routes/questionPaperNew'); 
const interviewRoutes = require('./routes/interviewRoutes'); 
const adminRoutes = require('./routes/adminRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const placementRoutes = require('./routes/placementRoutes');
const aiRoutes = require('./routes/aiRoutes'); // <--- NEW AI ROUTE FILE
const facultyRoutes = require('./routes/facultyRoutes');

// Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/question-papers', questionPaperRoutes);
app.use('/api/admin/question-papers', questionPaperRoutes);
app.use('/api/experiences', interviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/placements', placementRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/faculty', facultyRoutes);

// AI Logic (Refactored)
app.use('/api', aiRoutes); // This covers both /api/interview and /api/chatbot

// ROOT ROUTE
app.get('/', (req, res) => {
  res.send('Backend Server is Connected and Successfully running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));