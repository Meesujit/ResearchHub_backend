const express = require('express');

const multer = require('multer');


const {
    createResearchPaper,
    getAllResearchPapers,
    getUserResearchPapers,
    updateResearchPaperStatus,
    updateResearchPaper,
    deleteResearchPaper,

} = require('../controllers/researchPaperController')

const {authenticate, authorizeAdmin}  = require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({dest: 'uploads/'});

//User routes
router.post('/', authenticate, upload.single('file'), createResearchPaper);
router.get('/user', authenticate, getUserResearchPapers);
router.put('/:id', authenticate, updateResearchPaper);
router.delete('/:id', authenticate, deleteResearchPaper);


// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllResearchPapers); // Fetch all papers
router.put('/:id/status', authenticate, authorizeAdmin, updateResearchPaperStatus);// Approve/reject papers
router.delete('/:id', authenticate, authorizeAdmin, deleteResearchPaper); // Admin can delete any paper


module.exports = router;