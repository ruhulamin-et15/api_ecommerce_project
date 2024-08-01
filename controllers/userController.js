const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;
const { User } = require("../models/user.model");
const { findWithId } = require("../services/findItem");
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const {
  jwtActivationKey,
  clientURL,
  jwtResetPasswordKey,
} = require("../secret");
const { checkUserExists } = require("../helper/checkUserExists");
const { sendEmail } = require("../helper/sendEmail");

// GET All Users --OK
const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users || users.length == 0) {
      throw createError(404, "no users found this query");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "users were returned successfully",
      payload: {
        users,
        pagination: {
          totalUsers: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: (page + 1) << Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error) {
      next(createError(400, "no users found"));
      return;
    }
    next(error);
  }
};

// GET Single User --> OK
const handleGetUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const option = { password: 0 };
    const user = await findWithId(User, id, option);
    return successResponse(res, {
      statusCode: 200,
      message: "user were returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete User by ID --
const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const option = { password: 0 };
    await findWithId(User, id, option);
    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    return successResponse(res, {
      statusCode: 200,
      message: "user was delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Register User
const handleProcessRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // const image = req.file;
    // if(!image){
    //   throw createError(400, "Image file is required");
    // }
    // if(image.size > 1024 * 1024 * 2){
    //   throw createError(400, "Image is too large. It must be less than 2 MB");
    // }

    // const imageBufferString = image.buffer.toString("base64");

    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createError(
        409,
        "User with this email already exists, Please sign in"
      );
    }
    const phoneExists = await User.exists({ phone: phone });
    if (phoneExists) {
      throw createError(
        409,
        "User with this phone already exists, Please enter another number"
      );
    }

    //create jwt
    //image:imageBufferString
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    //prepare email
    const emailData = {
      email,
      subject: "Account activation mail",
      html: `
      <h2>Hello ${name} !</h2>
      <p>Please click here to <a href="${clientURL}/api/users/activate/${token} target="_blank">activate your account</a> </p>
      `,
    };

    //send email with nodemailer
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// activate user account
const handleActivateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify user");

      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "User with this email already exists, Please sign in"
        );
      }

      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name == "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// Update User by ID --
const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    const allowedFields = ["name", "phone", "password", "address"];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key == "email") {
        throw createError(400, "Email can not be updated!");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("Image is too large. It must be less than 2 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );
    if (!updatedUser) {
      throw createError(400, "User with this ID does not exists");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Handle Ban User by ID --
const handleBanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: true };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not Banned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user was Banned successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Handle Unban User by ID --
const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await findWithId(User, userId);
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User was not unbanned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user was unbanned successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// Update Password --
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.params.id;
    const user = await findWithId(User, userId);

    // compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Old Password is Incorrect");
    }

    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User password was not updated successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "user password was updated successfully!",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// Forget Password --
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });

    if (!userData) {
      throw createError(
        404,
        "Email is incorrect or you have not verified your email address! please register first"
      );
    }

    //create jwt
    const token = createJSONWebToken({ email }, jwtResetPasswordKey, "10m");

    //prepare email
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
      <h2>Hello ${userData.name} !</h2>
      <p>Please click here to <a href="${clientURL}/api/users/reset-password/${token} target="_blank">Reset your password</a> </p>
      `,
    };

    //send email with nodemailer
    sendEmail(emailData);

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to your ${email} for reseting the password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password --
const handleResetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const updates = { password: newPassword };
    const options = { new: true };
    const updatedUser = await User.findOneAndUpdate(
      filter,
      updates,
      options
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "Password reset failed");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "password reset successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleProcessRegister,
  handleActivateUserAccount,
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleUpdateUserById,
  handleBanUserById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
