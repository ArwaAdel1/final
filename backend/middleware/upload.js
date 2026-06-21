const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpeg|jpg|png|webp|gif)$/i;
  const allowedMime = /^image\//;
  if (allowedExt.test(file.originalname) || allowedMime.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("صور فقط مسموح بها (jpeg, jpg, png, webp)"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const settingsUpload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const categoryUpload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { upload, settingsUpload, categoryUpload, uploadToCloudinary };
