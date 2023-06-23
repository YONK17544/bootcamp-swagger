const config = {
     PORT: process.env.PORT || 8082,
     NODE_ENV: process.env.NODE_ENV || 'development',
     MONGO_URI: process.env.MONGO_URI,
}

export default config;