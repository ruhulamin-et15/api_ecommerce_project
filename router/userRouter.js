const express = require("express");
const userRouter = express.Router();
const { handleBanUserById, handleUnbanUserById, handleUpdatePassword, handleForgetPassword, handleResetPassword, handleGetUserById, handleProcessRegister, handleActivateUserAccount, handleUpdateUserById, handleDeleteUserById, handleGetUsers } = require("../controllers/userController");
const {upload} = require("../middlewares/uploadFile");
const { validateUpdatePassword, validateForgetPassword, validateResetPassword, validateUserRegistration } = require("../validators/auth");
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");



userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handleGetUserById);

userRouter.post("/process-register", upload.single("image"), isLoggedOut, validateUserRegistration, runValidation, handleProcessRegister);
userRouter.post("/activate", isLoggedOut, handleActivateUserAccount);
userRouter.post("/forget-password/", validateForgetPassword, runValidation, handleForgetPassword);

userRouter.put("/reset-password/", validateResetPassword, runValidation, handleResetPassword);
userRouter.put("/:id([0-9a-fA-F]{24})", upload.single("image"),  isLoggedIn, handleUpdateUserById)
userRouter.put("/ban-user/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleBanUserById);
userRouter.put("/unban-user/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleUnbanUserById);
userRouter.put("/update-password/:id([0-9a-fA-F]{24})", isLoggedIn, validateUpdatePassword, runValidation, handleUpdatePassword);

userRouter.delete("/:id([0-9a-fA-F]{24})",isLoggedIn, handleDeleteUserById);

module.exports = {userRouter};