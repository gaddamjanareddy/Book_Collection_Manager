// AddBookModal.jsx
import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AddBookModal = ({ open, handleClose, handleAddBook }) => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    year: "",
    genre: "",
    coverUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add book");
      }

      const newBook = await res.json();
      handleAddBook(newBook);
      Swal.fire({
        title: "Success!",
        text: `${newBook.title} added successfully.`,
        icon: "success"
      });
      setForm({ title: "", author: "", description: "", year: "", genre: "", coverUrl: "" });
      setSuccess("")
      handleClose();
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        navigate("/mybooks");
      }, 1000);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Add a New Book</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Image URL"
            name="coverUrl"
            value={form.coverUrl}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="dense"
            required
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={form.author}
            onChange={handleChange}
            margin="dense"
            required
          />
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="dense"
            multiline
            rows={3}
          />
          {error && <Typography color="error" mt={1}>{error}</Typography>}
          {success && <Typography color="success.main" mt={1}>{success}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddBookModal;
