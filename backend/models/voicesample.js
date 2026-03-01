const mongoose = require("mongoose");

const voiceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  sentenceNumber: Number,
  audioUrl: String,
  publicId: String,
});

module.exports = mongoose.model("VoiceSample", voiceSchema);