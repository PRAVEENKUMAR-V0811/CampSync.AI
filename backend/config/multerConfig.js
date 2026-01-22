// backend/config/multerConfig.js
const multer = require('multer');
const path = require('path');

// Check file type
const checkFileType = (file, cb) => {
  const filetypes = /pdf|doc|docx|ppt|pptx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, PPT, and PPTX files are allowed!'));
  }
};

// Use Memory Storage (Keep file in RAM to stream to Supabase)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;