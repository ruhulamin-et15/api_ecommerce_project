const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const { userRouter } = require("./router/userRouter");
const { errorResponse } = require("./controllers/responseController");
const { seedRouter } = require("./router/seedRouter");
const authRouter = require("./router/authRouter");
const { categoryRouter } = require("./router/categoryRouter");
const { productRouter } = require("./router/productRouter");


const rateLimiter = rateLimit({
    windowMs: 1* 60 * 1000,
    max: 10,
    message: "Too many request from this IP. Please try again later",
});


app.use(cookieParser())
app.use(rateLimiter);
app.use(xssClean());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("dev"))

//API
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

// API Testing
app.get("/", (req,res)=>{
    res.status(200).send({message: "API is working fine"});
});


// client Error handling
app.use((req, res, next)=>{
    next(createError(404, "route not found"));
});

// server Error handling -> all the errors
app.use((err, req, res, next)=>{
    return errorResponse(res, {
        statusCode: err.statusCode,
        message: err.message,
    });
});


module.exports = app;