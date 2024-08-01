const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { successResponse } = require("./responseController");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { setAccessToken, setRefreshToken } = require("../helper/cookie");

//login
const handleLogin = async (req,res,next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email});
        if(!user){
            throw createError(404, "User does not with this email, please register first")
        }

        // compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw createError(401, "Password did not match")
        }

        // isBanned
        if(user.isBanned){
            throw createError(403, "You are banned, please contact authority")
        }

        // create jwt access token
        const accessToken = createJSONWebToken({ user},
            jwtAccessKey,
            "5m"
        );
        setAccessToken(res, accessToken)

        // create jwt refresh token
        const refreshToken = createJSONWebToken({user},
            jwtRefreshKey,
            "7d"
        );
        setRefreshToken(res, refreshToken)

        //remove password
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return successResponse(res, {
            statusCode: 200,
            message: "user logged-in successfully",
            payload: {userWithoutPassword},
          });
    } catch (error) {
        next(error)
    }
};

//logout
const handleLogout = async (req,res,next) => {
    try {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        
        return successResponse(res, {
            statusCode: 200,
            message: "user logged-out successfully",
            payload: {},
          });
    } catch (error) {
        next(error)
    }
};

//refresh token
const handleRefreshToken = async (req,res,next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        //verify the old refresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
        
        if(!decodedToken){
            throw createError(401, "Invalid refresh token. Please login first")
        }

        const accessToken = createJSONWebToken( decodedToken.user,
            jwtAccessKey,
            "5m"
        );
        setAccessToken(res, accessToken)

        return successResponse(res, {
            statusCode: 200,
            message: "new access token is generated",
            payload: {},
          });
    } catch (error) {
        next(error)
    }
};

//protected route
const handleProtectedRoute = async (req,res,next) => {
    try {
        const accessToken = req.cookies.accessToken;

        //verify the access token
        const decodedToken = jwt.verify(accessToken, jwtAccessKey);
        
        if(!decodedToken){
            throw createError(401, "Invalid access token. Please login first")
        }

        return successResponse(res, {
            statusCode: 200,
            message: "protected resources accessed successfully",
            payload: {},
          });
    } catch (error) {
        next(error)
    }
};


module.exports = {
    handleLogin, 
    handleLogout, 
    handleRefreshToken,
    handleProtectedRoute,
};