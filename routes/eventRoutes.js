const express = require('express');

const {createEvent, getUserEvents, getAllEvents, updateEvent, deleteEvent, participateInEvent, publicEvents} = require('../controllers/eventController');

const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

const router = express.Router();

// User creates an event (admin only)
router.post('/create-event', verifyToken, authorizeRole('admin'), createEvent);

// User views their own events
router.get('/user-event', verifyToken, getUserEvents);

// Admin fetch all events (admin only)
router.get('/admin/all-events', verifyToken, authorizeRole('admin'), getAllEvents);

//Admin update an event only
router.put('/update-event/:id', verifyToken, authorizeRole('admin'), updateEvent);

//Admin delete an event only
router.delete('/delete-event/:id', verifyToken, authorizeRole('admin'), deleteEvent);

router.post('/participate/:id', verifyToken, participateInEvent);

router.get('/public-events', publicEvents);

module.exports = router;

