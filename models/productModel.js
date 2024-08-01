const mongoose = require("mongoose");

// name, slug, description, price, quantity, sold, shipping, image
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        unique: true,
        minlength: [3, "The length of product name can be minimum 3 characters"],
    },
    slug: {
        type: String,
        required: [true, "Product slug is required"],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Product desc is required"],
        trim: true,
        minlength: [3, "The length of product desc can be minimum 3 characters"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        trim: true,
        validate: {
            validator: (v)=> v > 0,
            message: (props)=>
                `${props.value} is not a valid price, price must be greater than 0`,
        },
    },
    quantity: {
        type: Number,
        required: [true, "Product quantity is required"],
        trim: true,
        validate: {
            validator: (v)=> v > 0,
            message: (props)=>
                `${props.value} is not a valid quantity, quantity must be greater than 0`,
        },
    },
    sold: {
        type: Number,
        required: [true, "sold quantity is required"],
        trim: true,
        default: 0,
    },
    shipping: {
        type: Number,
        default: 0, //shipping free or paid amount
    },
    image: {
        type: Buffer,
        contentType: String,
        required: [true, "Product image is required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }
}, {timestamps: true})

const Product = mongoose.model("Product", productSchema);
module.exports = {Product};