const cloudinary = require("cloudinary");

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