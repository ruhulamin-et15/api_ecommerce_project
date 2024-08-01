const { User } = require("../models/user.model");

const checkUserExists = async (email) => {
    return await User.exists({ email: email });
}

module.exports = {checkUserExists}