const express = require("express");
const categoryRouter = express.Router();
const { runValidation } = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");
const { handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory } = require("../controllers/categoryController");
const { validateCategory } = require("../validators/category");


//post /api/categories
categoryRouter.post("/", validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory);

//get /api/categories
categoryRouter.get("/", handleGetCategories, );
categoryRouter.get("/:slug", handleGetCategory, );

//put /api/categories
categoryRouter.put("/:slug",validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateCategory, );

//delete /api/categories
categoryRouter.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory, );

module.exports = {categoryRouter};