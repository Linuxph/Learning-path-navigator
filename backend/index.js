const express = require('express');

// Importing required modules
const cors = require('cors');
const helmet = require('helmet');
// Importing environment variables
require('dotenv').config();

//Importing routes
const auth = require('./routes/auth'); 
const paths = require('./routes/path');
const node = require('./routes/node');

// Importing database connection
const connectDB = require('./DB/connect');

// Creating an instance of express
const app = express();

// Setting the port
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    origins = ['http://localhost:5173'] 
));
app.use(helmet());

app.use('/api',auth);
app.use('/api', paths);
app.use('/api', node);

// Starting the server
app.listen(PORT, async() => {
    // Connecting to the database
    await connectDB()
        .then(() => console.log(`Server is running on http://localhost:${PORT}`))
        .catch(err => console.error('Database connection error:', err));
});