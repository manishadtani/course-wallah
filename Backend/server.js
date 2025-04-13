// backend/server.js

// dotenv import and config call removed

// Debug logs removed

import app from './src/app.js';
import config from './src/config/config.js'; // This now gets correct values
import connect from './src/db/db.js';

// Call database connection function
// Make sure connect() uses config.MONGO_URL correctly internally
connect();

// Start the Express server
app.listen(config.PORT, () => {
    console.log(`⚙️ Server is running on port: ${config.PORT}`); // Changed console log slightly
});