const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");
const Image = require("../models/Image");
const VoiceSample = require("../models/VoiceSample");
const bcrypt = require("bcryptjs");
const fs = require("fs");

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
      const { firstName, lastName, email, password, rollNo, age, gender, consent } = req.body;

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
        firstName,
        lastName: lastName || null,
        email,
        password: hashedPassword,
        rollNo,
        gender,
        age,
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

          // Delete temporary file after successful upload
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
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

          // Delete temporary file after successful upload
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        }
      }

      res.json({ message: "Dataset submitted successfully" });

    } catch (error) {
      console.error(error);
      
      // Cleanup temporary files on error
      if (req.files) {
        const allFiles = [...(req.files.images || []), ...(req.files.audio || [])];
        allFiles.forEach(file => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;