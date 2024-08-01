const app = require("./app");
const { logger } = require("./controllers/loggerController");
const connectDB = require("./models/db");
require("dotenv").config();
const PORT = process.env.PORT || 3002;

app.listen(PORT, async()=>{
    logger.log("info", `server is running at http://localhost:${PORT}`);
    await connectDB();
});