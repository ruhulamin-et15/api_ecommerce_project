// Upload file by binary operation
const multer = require("multer");
require("dotenv").config();
const {ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb) => {
  if(!file.mimetype.startsWith("image/")){
    return cb(new Error("Only image files are allowed"), false);
  }
  if(file.size > MAX_FILE_SIZE){
    return cb(new Error("File size exceeds the maximum limits"), false);
  }
  if(!ALLOWED_FILE_TYPES.includes(file.mimetype)){
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = {upload};



// // file upload by string type
// const path = require("path");
// const createError = require("http-errors");
// const { UPLOAD_USER_IMAGE_DIRECTORY, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");

// //String type image
// const storage = multer.diskStorage({
//     destination:(req, file, cb)=>{
//       cb(null, UPLOAD_USER_IMAGE_DIRECTORY)
//     },
//     filename:(req, file, cb)=>{
//       const extname = path.extname(file.originalname);
//       cb(null, Date.now() + "-" + file.originalname.replace(extname, "") + extname)
//     }
// });

// const fileFilter = (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     if(!ALLOWED_FILE_TYPES.includes(extname.substring(1))){
//       return cb(new Error("File type not allowed"),false);
//     }
//     cb(null, true)
// };

// const upload = multer({ 
//     storage: storage,
//     limits: {fileSize: MAX_FILE_SIZE},
//     fileFilter,
// })

