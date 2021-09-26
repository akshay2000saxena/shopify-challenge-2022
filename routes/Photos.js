const express = require("express");
const passport = require("passport");

const router = express.Router();

const { Photo } = require("../models/Photo");

const {
  cloudinaryUpload,
  cloudinaryDelete
} = require("../providers/cloudinary");

const { multerUpload } = require("../providers/multer");

router.get("/test", (req, res) => res.json({ message: "Photos work!" }));

router.post("/", passport.authenticate("jwt", { session: false }), multerUpload.any(), (req, res) => {
  const { user } = req;
  const { name } = req.body;
  const { path } = req.files[0];

  Photo.find({ name }).then(images => {
    if (images.length > 1) {
      return res.status(400).json({ message: "image already exists" });
    }

    cloudinaryUpload(path).then(async result => {
      const photo = new Photo({
        name,
        user: user.id,
        url: result.url
      });

      try {
        await photo.save();
        return res.json(photo);
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    })
      .catch(err => {
        console.error(err);
        return res.sendStatus(500);
      })
  })
});

router.delete("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id } = req.body;

  try {
    const photo = Photo.find({ id: id, user: req.user.id });

    if (!photo) {
      return res.status(404).json({ message: "Failed to find photo." });
    }

    await Photo.deleteOne({ id: id, user: req.user.id });
    cloudinaryDelete(id);
    return res.json({ message: "Successfully deleted photo." });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { name } = req.body;

  Photo.find({
    user: req.user.id,
    name: {
      $regex: name || "",
      $options: "i"
    }
  })
    .sort({ date: -1 })
    .then(photos => res.json(photos))
    .catch(err => res.status(404).message("Unable to retrieve photos."))
});

module.exports = router;