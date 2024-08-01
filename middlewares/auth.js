const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");

const isLoggedIn = async (req,res,next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            throw createError(401, "Access token not found, please login first")
        }
        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if(!decoded){
            throw createError (401, "Invalid access token, please login again")
        }
        req.user = decoded.user;
        next();
    } catch (error) {
        return next(error)
    }
};


const isLoggedOut = async (req,res,next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if(accessToken){
            throw createError(400, "User is already logged-in")
        }
        next();
    } catch (error) {
        return next(error)
    }
};


const isAdmin = async (req,res,next) => {
    try {
        console.log(req.user.isAdmin)
        if(!req.user.isAdmin){
            throw createError(403, "Forbidden. You must be an admin to access this resource")
        }
        next();
    } catch (error) {
        return next(error)
    }
};



module.exports = {
    isLoggedIn, 
    isLoggedOut, 
    isAdmin, 
}