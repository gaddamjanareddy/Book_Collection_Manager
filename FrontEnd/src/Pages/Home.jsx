import React, { useEffect, useState } from 'react';
import { Typography, Button, Container, Grid, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import axios from "axios";

const Home = ({ openAddBookModal }) => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [error, setError] = useState(null);

    const API_URL = "http://localhost:5000/users";

    // Fetch users from backend

const fetchUsers = async () => {
  setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { setError("You must be logged in."); setLoading(false); return; }
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data || []);
      setUserList && setUserList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };


    useEffect(() => {
        fetchUsers(); 
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <Container maxWidth="lg">
                <div className="py-16 text-center">
                    <LibraryBooksIcon className="text-6xl text-blue-600 mb-4" />
                    <Typography variant="h2" className="mb-6 text-gray-800 font-bold">
                        Book Collection Manager
                    </Typography>
                    <Typography variant="h5" className="mb-8 text-gray-600">
                        Organize and manage your personal library with ease
                    </Typography>

                    <Grid container spacing={4} className="justify-center mt-8">
                        <Grid item xs={12} md={6} lg={4}>
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <CollectionsBookmarkIcon className="text-4xl text-blue-500 mb-4" />
                                <Typography variant="h5" className="mb-4 font-semibold">
                                    View Collection
                                </Typography>
                                <Typography className="mb-4 text-gray-600">
                                    Browse and manage your existing book collection
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate('/MyBooks')}
                                    className="w-full"
                                >
                                    View Books
                                </Button>
                            </div>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <AddCircleIcon className="text-4xl text-green-500 mb-4" />
                                <Typography variant="h5" className="mb-4 font-semibold" >
                                  Add New Book
                                </Typography>
                                <Typography className="mb-4 text-gray-600">
                                    Add a new book to your collection
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={openAddBookModal}
                                    className="w-full"
                                >
                                    Add Book
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                {/* Table */}
                <TableContainer component={Paper} className='max-h-96 overflow-auto'>
                    <Table stickyHeader aria-label='sticky table'>
                        <TableHead className="bg-gray-100">
                            <TableRow  >
                                <TableCell sx={{fontSize:"large"}}>UserName</TableCell>
                                <TableCell sx={{fontSize:"large"}}>Email</TableCell>
                                <TableCell sx={{fontSize:"large"}}>Role</TableCell>
                                <TableCell sx={{fontSize:"large"}}>Access To Books</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>{user.role == "super_admin" || user.role == "admin" ? "Yes" : "No"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="text-center pb-8">
                    <Typography variant="body1" className="text-gray-600">
                        Keep track of your reading journey and organize your books efficiently
                    </Typography>
                </div>
            </Container>
        </div>
    );
};

export default Home;
