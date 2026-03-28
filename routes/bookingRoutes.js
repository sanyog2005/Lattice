// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// POST /bookings endpoint 
router.post('/bookings', bookingController.createBooking);

module.exports = router;