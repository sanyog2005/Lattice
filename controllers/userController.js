const pool = require('../config/db');

// GET /users/:id/bookings - Retrieve all bookings made by a specific user [cite: 14]
exports.getUserBookings = async (req, res) => {
    const userId = req.params.id;

    try {
        // Join with Events table to provide meaningful data to the user
        const [bookings] = await pool.query(
            `SELECT b.id AS booking_id, b.booking_code, b.booking_date, 
                    e.id AS event_id, e.title AS event_title, e.date AS event_date
             FROM Bookings b
             JOIN Events e ON b.event_id = e.id
             WHERE b.user_id = ?
             ORDER BY b.booking_date DESC`,
            [userId]
        );

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ error: 'Failed to retrieve user bookings' });
    }
};