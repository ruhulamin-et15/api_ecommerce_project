const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const { defaultImagePath } = require("../secret");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        uppercase: true,
        minlength: [3, "The length of user name can be minimum 3 characters"],
        maxlength: [31, "The length of user name can be maximum 31 characters"],
    },
    email: {
        type: String,
        required: [true, "User email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter valid email"
        }
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [6, "The length of user password can be minimum 6 characters"],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: Buffer,
        contentType: String,
        required: [false, "User image is required"]
    },
    address: {
        type: String,
        required: [true, "User address is required"],
        minlength: [3, "The length of user address can be minimum 3 characters"],
    },
    phone: {
        type: String,
        required: [true, "User phone is required"],
        validate: {
            validator: function(v){
                return /(^(\+8801|8801|01|008801))[1|3-9]{1}(\d){8}$/.test(v);
            },
            message: "Please enter a valid phone"
        }
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

const User = mongoose.model("users", userSchema);
module.exports = {User}