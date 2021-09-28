const cloudinary = require("cloudinary");

/**
 * Takes in a file and uploads it to Cloudinary
 */
const cloudinaryUpload = file => {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader.upload(
        file,
        result => {
          resolve({ url: result.url, id: result.public_id });
        },
        { resource_type: "auto" }
      )
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Takes in a file id and destroys its instance on Cloudinary
 */
const cloudinaryDelete = id => {
  return new Promise((resolve, reject) => {
    try {
      cloudinary.uploader.destroy(id).then(() => {
        resolve({ result: result.result });
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  cloudinaryUpload,
  cloudinaryDelete
};