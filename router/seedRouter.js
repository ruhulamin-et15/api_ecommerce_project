const express = require("express");
const { seedUser, seedProducts } = require("../controllers/seedController");
const { upload } = require("../middlewares/uploadFile");
const seedRouter = express.Router();


seedRouter.get("/users", upload.single("image"), seedUser);
seedRouter.get("/products", upload.single("image"), seedProducts);

module.exports = {seedRouter}