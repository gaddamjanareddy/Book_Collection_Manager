const express = require("express");
const Book = require("../models/Book");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("addedBy", "username role");
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a book (admin or student)
router.post("/", authenticateToken, authorizeRoles("admin", "student"), async (req, res) => {
  try {
    const { title, author, year, genre, description } = req.body;
    const newBook = new Book({
      id: Date.now(),
      title,
      author,
      year,
      genre,
      description,
      addedBy: req.user.id,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a book (admin only)
router.put("/:id", authenticateToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a book (admin or owner student)
router.delete("/:id", authenticateToken, authorizeRoles("admin", "student"), async (req, res) => {
  try {
    const book = await Book.findOne({ id: req.params.id });
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (req.user.role !== "admin" && book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this book" });
    }

    await Book.findOneAndDelete({ id: req.params.id });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
