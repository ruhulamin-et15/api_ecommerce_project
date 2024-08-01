const createError = require("http-errors");
const slugify = require("slugify");
const { successResponse } = require("./responseController");
const { Category } = require("../models/categoryModel");


// Register category
const handleCreateCategory = async (req, res, next) => {
    try {
      const {name} = req.body;
      const newCategory = await Category.create({
        name:name,
        slug: slugify(name),
      });
  
      return successResponse(res, {
        statusCode: 201,
        message: "category created successfully",
        payload: newCategory,
      });
  
    } catch (error) {
      next(error);
    }
};

// Get categories
const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).select("name slug").lean();

    return successResponse(res, {
      statusCode: 200,
      message: "categories fetched successfully",
      payload: categories,
    });

  } catch (error) {
    next(error);
  }
};

// Get category
const handleGetCategory = async (req, res, next) => {
  try {
    const {slug} = req.params;
    const category = await Category.find({slug}).select("name slug").lean();

    if(!category){
      throw createError(404, "category not found")
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category fetched successfully",
      payload: category,
    });

  } catch (error) {
    next(error);
  }
};

// update category
const handleUpdateCategory = async (req, res, next) => {
  try {
    const {name} = req.body;
    const {slug} = req.params;
    const filter = {slug};
    const updates = {$set: {name: name, slug: slugify(name)}};
    const option = {new: true}
    const updatedCategory = await Category.findOneAndUpdate(
      filter, 
      updates,
      option,
    );

    if(!updatedCategory){
      throw createError(404, "category not found with this slug")
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category updated successfully",
      payload: updatedCategory,
    });

  } catch (error) {
    next(error);
  }
};

// deleted category
const handleDeleteCategory = async (req, res, next) => {
  try {
    const {slug} = req.params;
    const result = await Category.findOneAndDelete({slug})

    if(!result){
      throw createError(404, "category not found/delete with this slug")
    }

    return successResponse(res, {
      statusCode: 200,
      message: "category deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory, }