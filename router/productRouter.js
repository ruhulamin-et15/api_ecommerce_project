const express = require("express");
const productRouter = express.Router();
const { handleCreateProduct, handleGetProducts, handleGetProduct, handleDeleteProduct, handleUpdateProduct } = require("../controllers/productController");
const { upload } = require("../middlewares/uploadFile");
const { validateProduct } = require("../validators/product");
const { runValidation } = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

// post: api/products
productRouter.post("/", upload.single("image"),isLoggedIn, isAdmin, validateProduct, runValidation, handleCreateProduct);

// get: api/products
productRouter.get("/", handleGetProducts);
// get: api/product
productRouter.get("/:slug", handleGetProduct);

// put: api/product
productRouter.put("/:slug", upload.single("image"), isLoggedIn, isAdmin, handleUpdateProduct);

// delete: api/product
productRouter.delete("/:slug", handleDeleteProduct);


module.exports = {productRouter};