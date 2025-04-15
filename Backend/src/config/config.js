// backend/src/config/config.js

// dotenv import removed

// Debug logs removed

// Create the config object directly using process.env
// process.env will now have values loaded by -r dotenv/config
const _config = {
    PORT: process.env.PORT || 3000,
    // Make sure the key matches your .env file (MONGO_URL)
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN // Include this if it's in your .env
};




// Freeze the object
const config = Object.freeze(_config);

// ... inside config.js, before export default config;
console.log("--- CONFIG.JS (DB Check) ---");
console.log("Value of config.MONGO_URL:", config.MONGO_URL); // Check the final exported value
console.log("--- /CONFIG.JS (DB Check) ---");

// Export the frozen config object
export default config;