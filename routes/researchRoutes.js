const express = require('express');
const {submitPaper, getAllPapers, approvePaper, rejectPaper, getUserPapers, getPublicPapers, requestChange,
    getPendingRequests, processRequest, getUserRequests, updatePaper, deletePaper
} = require('../controllers/researchController');
const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');


const router = express.Router();

// User submit paper 
router.post('/submit', verifyToken, submitPaper);
// User View 
router.get('/user', verifyToken, getUserPapers);

// Admin fetch all research papers
router.get('/admin/all', verifyToken, authorizeRole('admin'), getAllPapers);

router.put('/approve/:id', verifyToken, authorizeRole('admin'), approvePaper);

router.put('/reject/:id', verifyToken, authorizeRole('admin'), rejectPaper);

// Guest view public papers
router.get('/public', getPublicPapers);

// ✅ Allow users to update their own approved papers
router.put('/update/:id', verifyToken, updatePaper);

// ✅ Allow users to delete their own approved papers
router.delete('/delete/:id', verifyToken, deletePaper);





module.exports = router;

