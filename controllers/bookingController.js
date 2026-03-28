// controllers/bookingController.js
const pool = require('../config/db');

exports.createBooking = async (req, res) => {
    const { user_id, event_id } = req.body;

    // Basic Input Validation [cite: 16]
    if (!user_id || !event_id) {
        return res.status(400).json({ error: 'user_id and event_id are required' });
    }

    // Get a dedicated connection from the pool for the transaction
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction(); // 1. Start Transaction 

        // 2. Lock the row to prevent race conditions 
        const [rows] = await connection.query(
            'SELECT remaining_tickets FROM Events WHERE id = ? LIMIT 1 FOR UPDATE',
            [event_id]
        );

        if (rows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Event not found' });
        }

        const remainingTickets = rows[0].remaining_tickets;

        if (remainingTickets <= 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Tickets are sold out for this event' });
        }

        // 3. Decrement tickets 
        await connection.query(
            'UPDATE Events SET remaining_tickets = remaining_tickets - 1 WHERE id = ?',
            [event_id]
        );

        // 4. Generate unique booking code 
        const bookingCode = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        // 5. Insert booking
        const [result] = await connection.query(
            'INSERT INTO Bookings (user_id, event_id, booking_code) VALUES (?, ?, ?)',
            [user_id, event_id, bookingCode]
        );

        await connection.commit(); // 6. Commit transaction

        res.status(201).json({
            message: 'Booking successful',
            booking_id: result.insertId,
            booking_code: bookingCode // Provided to user post booking 
        });

    } catch (error) {
        await connection.rollback(); // Rollback on any error
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Internal server error during booking' });
    } finally {
        connection.release(); // Always release the connection back to the pool
    }
};