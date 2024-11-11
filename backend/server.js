require('dotenv').config(); // Load env variables

const express = require('express');
const connectDB = require('./config/db'); // connect DB

connectDB(); // connect MongoDB

const app = express();
app.use(express.json());

// Imports and use routes
app.use('/api/events', require('./routes/events'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


