import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddBookModal from "../Components/AddBookModal";
import {
  Card, CardContent, CardMedia, Typography, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

// Simple debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const MyBooks = ({ booksList, setBooksList }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState(booksList || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateDialog, setUpdateDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    author: "",
    description: "",
    coverUrl: "",
    year: "",
    genre: ""
  });
  const [addModalOpen, setAddModalOpen] = useState(false);

  const API_URL = "http://localhost:5000/books";

  // Fetch all books
  const fetchBooks = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { setError("You must be logged in."); setLoading(false); return; }
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data || []);
      setBooksList && setBooksList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Update book dialog handlers
  const handleUpdateClick = (book) => {
    setSelectedBook(book);
    setUpdatedData({
      coverUrl: book.coverUrl,
      title: book.title,
      year: book.year,
      author: book.author,
      description: book.description,
      genre: book.genre || ""
    });
    setUpdateDialog(true);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setError(Swal.fire({ title: "Error", text: "You must be logged in.", icon: "error" })); return; }
    try {
      await axios.put(`${API_URL}/${selectedBook._id}`, updatedData, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(prev => prev.map(book => book._id === selectedBook._id ? { ...book, ...updatedData } : book));
      Swal.fire({ title: "Success", text: "Book updated successfully!", icon: "success" }); 
      setUpdateDialog(false);
    } catch (err) {
      setError(err.response?.data?.error || Swal.fire({ title: "Error", text: "Failed to update book.", icon: "error" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  // Delete book
  const handleDelete = async (id) => {
    const book = books.find(b => b._id === id);
    Swal.fire({
        title: `Are you sure you want to delete ${book.title}?`,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#d33',
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({
            title: "Deleted!",
            text: `${book.title} has been deleted.`,
            icon: "success"
        });
             const token = localStorage.getItem("token");
            if (!token) { setError("You must be logged in."); return; }
        try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(prev => prev.filter(book => book._id !== id));
      setBooksList && setBooksList(prev => prev.filter(book => book._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete book");
    }
    }});
};
  const handleView = (book) => {
    navigate(`/book-details/${book._id}`, { state: { book } });
  };

  // Add book handler
  const handleAddBookToList = (book) => {
    setBooks(prev => [book, ...prev]);
    setBooksList && setBooksList(prev => [book, ...prev]);
  };

  // Debounced search function
  const performSearch = async (query) => {
    if (!query) {
      fetchBooks();
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API_URL}/search`, { query }, { headers: { Authorization: `Bearer ${token}` } });
      setBooks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Search failed");
    }
  };

  const debouncedSearch = useCallback(debounce(performSearch, 1000), []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <>
      <AddBookModal
        open={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
        handleAddBook={handleAddBookToList}
      />

      <div className="container mx-auto px-4 py-6">
        <Typography variant="h4" component="h1" className="mb-6">My Books</Typography>

        <div className="pb-6">
          <TextField
            fullWidth
            color="inherit"
            className="border-black hover:border-gray-500"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
            margin="normal"
          />
        </div>

        {loading ? <CircularProgress /> :
          error ? <p className="text-red-600">{error}</p> :
            books.length === 0 ? <p>No books found.</p> :
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <Card key={book._id} className="flex flex-col">
                    {book.coverUrl ?
                      <CardMedia component="img" className="h-50" image={book.coverUrl} alt={book.title} /> :
                      <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400">No Image Available</div>
                    }
                    <CardContent className="flex flex-col flex-1">
                      <Typography variant="h6">{book.title}</Typography>
                      <Typography variant="subtitle2">{book.author}</Typography>
                      <Typography variant="body2">{book.description}</Typography>
                      <div className="flex justify-between mt-3">
                        <Button variant="contained" color="primary" onClick={() => handleView(book)}>View</Button>
                        <Button variant="contained" color="warning" onClick={() => handleUpdateClick(book)}>Update</Button>
                        <Button variant="contained" color="error" onClick={() => handleDelete(book._id)}>Delete</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        }

        {/* Update Dialog */}
        <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)}>
          <DialogTitle>Update Book</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="dense" name="title" label="Title" value={updatedData.title} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="author" label="Author" value={updatedData.author} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="description" label="Description" multiline rows={4} value={updatedData.description} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="coverUrl" label="Cover URL" value={updatedData.coverUrl} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="year" label="Year" type="number" value={updatedData.year} onChange={handleInputChange} />
            <TextField fullWidth margin="dense" name="genre" label="Genre" value={updatedData.genre} onChange={handleInputChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default MyBooks;
