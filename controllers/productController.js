const createError = require("http-errors");
const slugify = require("slugify");
const { successResponse } = require("./responseController");
const { Product } = require("../models/productModel");
const { populate } = require("dotenv");

// Register User
const handleCreateProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "Image is too large. It must be less than 2 MB");
    }
    const imageBufferString = image.buffer.toString("base64");

    const productExists = await Product.exists({ name: name });
    if (productExists) {
      throw createError(409, "Product with this name already exists");
    }

    //create product
    const product = await Product.create({
      name: name,
      slug: slugify(name),
      description: description,
      price: price,
      quantity: quantity,
      shipping: shipping,
      image: imageBufferString,
      category: category,
    });

    return successResponse(res, {
      statusCode: 201,
      message: "product created successfully",
      payload: { product },
    });
  } catch (error) {
    next(error);
  }
};

// get products
const handleGetProducts = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      $or: [{ name: { $regex: searchRegExp } }],
    };

    const products = await Product.find(filter)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!products) throw createError(404, "no products found");

    const count = await Product.find(filter).countDocuments();

    return successResponse(res, {
      statusCode: 200,
      message: "products were returned successfully",
      payload: {
        products: products,
        pagination: {
          totalProducts: count,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: (page + 1) << Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// get a product
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.find({ slug })
      .select("name slug")
      .lean()
      .populate("category");

    if (!product) {
      throw createError(404, "product not found with this slug");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was returned successfully",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

// update product
const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const updateOption = { new: true, runValidators: true, context: "query" };
    let updates = {};
    const allowedFields = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
    ];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can not be updated");
      }
    }

    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw new Error("Image is too large. It must be less than 2 MB");
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      updates,
      updateOption
    );

    if (!updatedProduct) {
      throw createError(404, "product not found/updated with this slug");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was updated successfully",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// deleted product
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await Product.findOneAndDelete({ slug });

    if (!result) {
      throw createError(404, "product not found/delete with this slug");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreateProduct,
  handleGetProducts,
  handleGetProduct,
  handleUpdateProduct,
  handleDeleteProduct,
};
