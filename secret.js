require("dotenv").config();

const defaultImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/dp.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "ldkjfsdjfsjfds456345kljfd";
const jwtAccessKey = process.env.JWT_ACCESS_KEY || "fhdfasdfhashdfksdas";
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "kdfhgkhgdfaksjdf";
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "FGKSDJKFGSDJFG"

const smtpUsername = process.env.SMTP_USERNAME || "";

const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL;


module.exports = {
  defaultImagePath,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  jwtAccessKey,
  jwtRefreshKey,
  jwtResetPasswordKey,
};
