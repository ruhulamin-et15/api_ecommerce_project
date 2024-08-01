const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true,
        unique: true,
        minlength: [3, "The length of category name can be minimum 3 characters"],
    },
    slug: {
        type: String,
        required: [true, "Category slug is required"],
        lowercase: true,
    },

}, {timestamps: true})

const Category = mongoose.model("Category", categorySchema);
module.exports = {Category}