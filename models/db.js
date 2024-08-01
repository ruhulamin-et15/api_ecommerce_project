const mongoose = require("mongoose");
const { logger } = require("../controllers/loggerController");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URL);
        logger.log("info", "Database connected!");
    } catch (error) {
        logger.log("error","DB not connected");
        logger.log("error",error);
        process.exit(1);
    }
};

module.exports = connectDB;