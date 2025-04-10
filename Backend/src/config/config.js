const _config = {
    PORT:process.env.PORT || 3000,
    MONGO_URL:process.env.MONGO_URL || "mongodb://127.0.0.1:27017/coursewallah",
    // JWT_SECRET:process.env.SECRET_KEY
}


const config = Object.freeze(_config)

export default config