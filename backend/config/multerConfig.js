// // backend/config/multerConfig.js
// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Create 'uploads' directory if it doesn't exist
//     const uploadDir = path.join(__dirname, '../uploads');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir); // Files will be temporarily stored in the 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // Accept only PDF, DOCX, and common image formats
//   const filetypes = /pdf|doc|docx|jpg|jpeg|png|gif/;
//   const mimetype = filetypes.test(file.mimetype);
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimetype && extname) {
//     return cb(null, true);
//   }
//   cb(new Error('Only PDF, DOCX, and image files are allowed!'), false);
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
// });

// module.exports = upload;

// backend/config/multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created uploads directory at: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = upload;
