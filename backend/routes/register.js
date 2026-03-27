const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/user");
const Image = require("../models/Image");
const VoiceSample = require("../models/VoiceSample");
const bcrypt = require("bcryptjs");
const streamifier = require("streamifier");

const router = express.Router();

// Use memoryStorage — no temp directory needed, works on any host (Render, etc.)
const upload = multer({ storage: multer.memoryStorage() });

// Helper: upload a buffer to Cloudinary via a stream
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

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
      if (req.files && req.files.images) {
        for (let file of req.files.images) {
          const result = await uploadToCloudinary(file.buffer, {
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

      // 3️⃣ Upload audio files to Cloudinary
      if (req.files && req.files.audio) {
        let sentenceNumber = 1;

        for (let file of req.files.audio) {
          const result = await uploadToCloudinary(file.buffer, {
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
      console.error("Register error:", error);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

module.exports = router;