const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: "dprsygcvh",
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospitals', // The folder name
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => req.params.id, 
  },
});

const upload = multer({ storage: storage });
module.exports = upload;