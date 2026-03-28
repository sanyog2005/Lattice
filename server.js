require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes = require('./routes/api');

const app = express();

app.use(cors()); 

app.use(express.json()); // Middleware to parse JSON bodies

// Register routes
app.use('/api', bookingRoutes);
app.use('/api', eventRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});