const createError = require("http-errors");
const { default: mongoose } = require("mongoose");

const findWithId = async (Model, id, option = {}) => {
    try {
        const item = await Model.findById(id, option);
        if (!item) {
            throw createError(404, `${Model.modelName} does not exist with this id`);
        }
        return item;
    } catch (error) {
        if(error instanceof mongoose.Error){
            createError(400, "Invalid Item Id");
        }
        throw error;
    }
};

module.exports = {findWithId}