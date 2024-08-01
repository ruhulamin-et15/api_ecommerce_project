const {body} = require("express-validator");


//registration validation
const validateUserRegistration = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your Name")
    .isLength({min: 3, max: 31})
    .withMessage("Name should be at least 3-31 characters"),

    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your Email")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your Password")
    .isLength({min: 6})
    .withMessage("Password should be at least 6 characters")
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za=z\d@!$%&*?]+$/
    )
    .withMessage("Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character."),

    body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter Your Address")
    .isLength({min: 3})
    .withMessage("the length of user address can be minimum 3 characters"),

    body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required, Enter Your Phone Number")
    .matches(
        /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/
    )
    .withMessage("Invalid Phone Number, Enter Valid Phone Number"),

    // body("image")
    // .custom((value, {req}) => {
    //     if(!req.file || !req.file.buffer){
    //         throw new Error("User image is required");
    //     }
    //     return true;
    // })
    // .withMessage("User Image is required, Please select image"),
    
]

//Login validation
const validateUserLogin = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your Email")
    .isEmail()
    .withMessage("Invalid email address"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your Password")
    .isLength({min: 6})
    .withMessage("Password should be at least 6 characters")
]

//Update Password validation
const validateUpdatePassword = [
    body("oldPassword")
    .trim()
    .notEmpty()
    .withMessage("Old Password is required. Enter your Old Password")
    .isLength({min: 6})
    .withMessage("Old Password should be at least 6 characters"),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your New Password")
    .isLength({min: 6})
    .withMessage("New Password should be at least 6 characters"),

    body("confirmPassword").custom((value, {req})=>{
        if(value !== req.body.newPassword){
            throw new Error("Please new password match in confirm password field")
        }
        return true;
    })
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required. Enter your Confirm Password")
    .isLength({min: 6})
    .withMessage("Confirm Password should be at least 6 characters"),
]

//Forget Password validation
const validateForgetPassword = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your Email")
    .isEmail()
    .withMessage("Invalid email address"),
]

//Reset Password validation
const validateResetPassword = [
    body("token")
    .trim()
    .notEmpty()
    .withMessage("Token is required. Enter your Token"),

    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required. Enter your New Password")
    .isLength({min: 6})
    .withMessage("New Password should be at least 6 characters"),

    body("confirmPassword").custom((value, {req})=>{
        if(value !== req.body.newPassword){
            throw new Error("Please new password match in confirm password field")
        }
        return true;
    })
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required. Enter your Confirm Password")
    .isLength({min: 6})
    .withMessage("Confirm Password should be at least 6 characters"),
]



module.exports = { validateUserRegistration, validateUserLogin, validateUpdatePassword, validateForgetPassword, validateResetPassword, }