const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: String,
  publicId: String,
});

module.exports = mongoose.model("Image", imageSchema);