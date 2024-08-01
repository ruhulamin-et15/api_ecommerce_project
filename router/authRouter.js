const express = require("express");
const authRouter = express.Router();
const { handleLogin, handleLogout, handleRefreshToken, handleProtectedRoute } = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validateUserLogin } = require("../validators/auth");
const { runValidation } = require("../validators");



authRouter.post("/login", validateUserLogin, runValidation, isLoggedOut, handleLogin);
authRouter.get("/refresh-token", handleRefreshToken);
authRouter.post("/logout", isLoggedIn, handleLogout);
authRouter.get("/protected", handleProtectedRoute)


module.exports = authRouter;