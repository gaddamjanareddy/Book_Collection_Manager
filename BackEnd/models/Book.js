const mongoose = require("mongoose");

const Books_schema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model("Book", Books_schema);
