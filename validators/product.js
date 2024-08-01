const {body} = require("express-validator");


const validateProduct = [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Product Name is required.")
    .isLength({min: 3})
    .withMessage("Product Name should be at least 3 characters long"),

    body("description")
    .trim()
    .notEmpty()
    .withMessage("Product Description is required.")
    .isLength({min: 3})
    .withMessage("Product Description should be at least 3 characters long"),

    body("price")
    .trim()
    .notEmpty()
    .withMessage("Product Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Product Price must be a positive number"),

    body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),

    body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive number"),
]


module.exports = { validateProduct, }