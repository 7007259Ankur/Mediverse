const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');

const uploadDir = path.join(__dirname, '../uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },


    // filename: (req, file, cb) => {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    //   cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    // }

    // Modify the filename function in multer config:
     filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'file-' + uniqueSuffix + path.extname(file.originalname);
    // Store relative path
    req.fileRelativePath = path.join('uploads', filename).replace(/\\/g, '/');
    cb(null, filename);
  }


  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) return cb(null, true);
    cb(createError(400, 'Only images (JPEG/PNG) and PDFs are allowed'));
  }
});

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return next(createError(400, err.message));
  } else if (err) {
    return next(err);
  }
  next();
};

module.exports = { upload, handleUploadErrors };