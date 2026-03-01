const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");
const Image = require("../models/Image");
const VoiceSample = require("../models/VoiceSample");
const bcrypt = require("bcryptjs");

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post(
  "/register",
  upload.fields([
    { name: "images" },
    { name: "audio" }
  ]),
  async (req, res) => {
    try {
      const { fullName, email, password, rollNo, age, branch, consent } = req.body;

      if (!consent || consent === 'false') {
        return res.status(400).json({ error: "Consent is required" });
      }

      // 1️⃣ Create user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        rollNo,
        age,
        branch,
        consent: consent === 'true' || consent === true
      });

      // 2️⃣ Upload images to Cloudinary
      if (req.files.images) {
        for (let file of req.files.images) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "personalock/images",
            resource_type: "image",
          });

          await Image.create({
            userId: user._id,
            imageUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      }

      // 3️⃣ Upload audio files
      if (req.files.audio) {
        let sentenceNumber = 1;

        for (let file of req.files.audio) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "personalock/audio",
            resource_type: "video",
          });

          await VoiceSample.create({
            userId: user._id,
            sentenceNumber: sentenceNumber++,
            audioUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      }

      res.json({ message: "Dataset submitted successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;