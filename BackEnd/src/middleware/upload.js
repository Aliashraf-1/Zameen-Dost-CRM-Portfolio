const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ✅ Create upload directories - FIXED typo
const uploadDir = path.join(__dirname, '../../uploads');
const unitImagesDir = path.join(uploadDir, 'unit-images');
const tenantImagesDir = path.join(uploadDir, 'tenant-images');
const agreementsDir = path.join(uploadDir, 'agreements');

// ✅ FIXED: uploadDir (not uploaDir)
[uploadDir, unitImagesDir, tenantImagesDir, agreementsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'unitImage') {
      cb(null, unitImagesDir);
    } else if (file.fieldname === 'tenantImage') {
      cb(null, tenantImagesDir);
    } else if (file.fieldname === 'agreementFiles') {
      cb(null, agreementsDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + unique + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, PDF allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});

module.exports = upload;