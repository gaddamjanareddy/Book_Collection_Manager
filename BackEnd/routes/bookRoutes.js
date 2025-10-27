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

// Add a book (student or admin)
router.post("/", authenticateToken, authorizeRoles("admin", "student"), async (req, res) => {
  try {
    const { coverUrl, title, author, year, genre, description } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const newBook = new Book({
      coverUrl,
      title,
      author,
      year,
      genre,
      description,
      addedBy: req.user._id
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Update a book (any logged-in user)
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { imageURL, title, author, year, genre, description } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    book.coverUrl = imageURL || book.coverUrl;
    book.title = title || book.title;
    book.author = author || book.author;
    book.year = year || book.year;
    book.genre = genre || book.genre;
    book.description = description || book.description;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a book (any logged-in user)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// search books by title or author
router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } }
      ]
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
