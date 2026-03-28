const express = require('express');
const router = express.Router();

// Import Controllers
const eventController = require('../controllers/eventController');
const bookingController = require('../controllers/bookingController');
const userController = require('../controllers/userController');

// --- Event Routes ---
// List all upcoming events [cite: 13]
router.get('/events', eventController.getAllUpcomingEvents); 
// Create a new event [cite: 13]
router.post('/events', eventController.createEvent); 
// Check attendance [cite: 14]
router.post('/events/:id/attendance', eventController.checkAttendance); 

// --- Booking Routes ---
// Book a ticket (using the transaction controller from previous step) [cite: 14]
router.post('/bookings', bookingController.createBooking); 

// --- User Routes ---
// Retrieve all bookings made by a specific user [cite: 14]
router.get('/users/:id/bookings', userController.getUserBookings); 

module.exports = router;