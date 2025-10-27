const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  coverUrl: { type: String },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  genre: { type: String },
  description: { type: String },
  coverUrl: { type: String },
  infoLink: { type: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
