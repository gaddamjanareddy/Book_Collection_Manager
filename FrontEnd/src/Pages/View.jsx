import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import Swal from 'sweetalert2';

const ViewBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { book } = location.state || {};

  const [open, setOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    description: book?.description || "",
    coverUrl: book?.coverUrl || "",
  });

  const API_URL = "http://localhost:5000/books";

  const handleBack = () => navigate(-1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    try {
      await axios.put(`${API_URL}/${book._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ title: "Success", text: "Book updated successfully!", icon: "success" });
      setOpen(false);
      
      navigate("/mybooks");
    } catch (err) {
      Swal.fire({ title: "Error", text: "Failed to update book: " + (err.response?.data?.error || err.message), icon: "error" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this book?",
      icon: "warning",
      showCancelButton: true
    });
    if (!result.isConfirmed) return;

    Swal.fire({ title: "Deleted!", text: `${book.title} deleted successfully!`, icon: "success" });
    const token = localStorage.getItem("token");
    if (!token) { setError(Swal.fire({ title: "Error", text: "You must be logged in.", icon: "error" })); return; }
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setBooks(prev => prev.filter(book => book._id !== id));
            setBooksList && setBooksList(prev => prev.filter(book => book._id !== id));
        } catch (err) {
            setError(err.response?.data?.error || Swal.fire({ title: "Error", text: "Failed to delete book.", icon: "error" }));
        }
        finally{
          setTimeout(() => {
            navigate("/mybooks");
          }, 100);
        }
    };



  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="text-center bg-white shadow-md rounded-lg p-6 max-w-sm">
          <Typography variant="h6">No book details available.</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const cover = book.coverUrl || book.image || book.cover || null;

  const initials = (title = "") =>
    title
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          className="mb-4"
        >
          Back
        </Button>

        <Card
          className="shadow-xl"
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "stretch",
            p: { xs: 2, sm: 3 },
            flexDirection: { xs: "column", sm: "row" },
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: 160 },
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {cover ? (
              <CardMedia
                component="img"
                image={cover}
                alt={book.title}
                sx={{
                  width: { xs: "100%", sm: 160 },
                  height: { xs: 220, sm: 220 },
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: "100%", sm: 160 },
                  height: { xs: 220, sm: 220 },
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(236,72,153,0.08))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <Typography variant="h3" color="text.secondary">
                  {initials(book.title)}
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent sx={{ flex: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <div>
                <Typography variant="h5" component="h1" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  by <strong>{book.author || "Unknown author"}</strong>
                </Typography>
              </div>

              {/* <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "Unknown"}
                  color="primary"
                  size="small"
                />
              </Stack> */}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 2, whiteSpace: "pre-wrap" }}
            >
              {book.description || "No description provided."}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setOpen(true)}
              >
                Edit
              </Button>
              <Button variant="outlined" color="primary" size="small" disabled={true}> Add to Collection </Button>
              <Button variant="outlined" color="error" size="small" onClick={() => {handleDelete(book._id)}} > Delete </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Update Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Update Book</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              name="title"
              label="Title"
              value={updatedData.title}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="author"
              label="Author"
              value={updatedData.author}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={updatedData.description}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense"
              name="coverUrl"
              label="Cover URL"
              value={updatedData.coverUrl}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">Update</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ViewBook;
