const pool = require('../config/db');

// GET /events - List all upcoming events [cite: 13]
exports.getAllUpcomingEvents = async (req, res) => {
    try {
        // Only fetch events where the date is in the future
        const [events] = await pool.query(
            'SELECT * FROM Events WHERE date > NOW() ORDER BY date ASC'
        );
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
};

// POST /events - Create a new event [cite: 13]
exports.createEvent = async (req, res) => {
    const { title, description, date, total_capacity } = req.body;

    // Input validation [cite: 16]
    if (!title || !date || !total_capacity) {
        return res.status(400).json({ error: 'Title, date, and total_capacity are required' });
    }

    if (total_capacity <= 0) {
        return res.status(400).json({ error: 'Capacity must be greater than 0' });
    }

    try {
        // remaining_tickets initially equals total_capacity
        const [result] = await pool.query(
            `INSERT INTO Events (title, description, date, total_capacity, remaining_tickets) 
             VALUES (?, ?, ?, ?, ?)`,
            [title, description || '', date, total_capacity, total_capacity]
        );

        res.status(201).json({
            message: 'Event created successfully',
            event_id: result.insertId
        });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};

// POST /events/:id/attendance - Verify code and check tickets booked [cite: 14]
exports.checkAttendance = async (req, res) => {
    const eventId = req.params.id;
    const { booking_code } = req.body;

    if (!booking_code) {
        return res.status(400).json({ error: 'booking_code is required' });
    }

    try {
        // Find the booking matching the code and event
        const [bookings] = await pool.query(
            'SELECT * FROM Bookings WHERE event_id = ? AND booking_code = ?',
            [eventId, booking_code]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'Invalid booking code for this event' });
        }

        const booking = bookings[0];

        // Optional: Record the entry in the Event_Attendance table
        await pool.query(
            'INSERT INTO Event_Attendance (user_id, event_id) VALUES (?, ?)',
            [booking.user_id, eventId]
        );

        // Based on our schema, one booking code = one ticket. 
        // If your schema supported multiple tickets per transaction, you would sum them here.
        res.status(200).json({
            message: 'Attendance verified successfully',
            tickets_booked: 1, 
            user_id: booking.user_id
        });

    } catch (error) {
        console.error('Error checking attendance:', error);
        res.status(500).json({ error: 'Failed to verify attendance' });
    }
};