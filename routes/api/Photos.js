const express = require("express");
const router = express.Router();
const passport = require("passport");

// schemas
const { Photo } = require("../../models/Photo");

// image upload utilities
const {
  cloudinaryUpload,
  cloudinaryDelete
} = require("../../providers/cloudinary");
const { multerUpload } = require("../../providers/multer");


router.get("/test", (req, res) => res.json({ message: "Photos works" }));


router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  multerUpload.any(),
  (req, res) => {

    console.log(req);

    const { user } = req;
    const { name } = req.body;
    const { path } = req.files[0];

    // find image
    Photo.find({ name }).then(images => {
      // duplicate image found
      if (images.length > 1) {
        return res.status(400).json({ message: "Image already exists" });
      }

      // upload image to cloudinary
      cloudinaryUpload(path)
        .then(async result => {
          // save on database
          const photo = new Photo({
            name,
            user: user.id,
            url: result.url
          });

          try {
            await photo.save();
            return res.json(photo);
          } catch (e) {
            return res.sendStatus(500);
          }
        })
        .catch(err => {
          return res.sendStatus(500);
        });
    });
  }
);

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id } = req.body;

    try {
      // find photo that belongs to this user
      const photo = Photo.find({ _id: id, user: req.user.id });
      if (!photo) {
        return res.status(404).json({ message: "Failed to find photo" });
      }

      // delete the photo
      await Photo.deleteOne({ _id: id, user: req.user.id });
      cloudinaryDelete(id);
      return res.json({ message: "Successfully deleted photo" });
    } catch (err) {
      return res.status(500);
    }
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { name } = req.body;

    // fetch all photos, ordered by date
    Photo.find({
      user: req.user.id,
      name: {
        $regex: name || "",
        $options: "i"
      }
    })
      .sort({ date: -1 })
      .then(photos => res.json(photos))
      .catch(err => res.status(404).message("Unable to retrieve photos"));
  }
);

module.exports = router;