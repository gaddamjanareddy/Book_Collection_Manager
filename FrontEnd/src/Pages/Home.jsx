import React from 'react';
import { Typography, Button, Container, Grid } from '@mui/material';
import { Router,useNavigate } from "react-router-dom";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import Navbar from '../Components/Navbar';


const Home = () => {
    const navigate = useNavigate();

    return (
        <>
        <Navbar />
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
                                    onClick={() => navigate('/collection')}
                                    className="w-full"
                                >
                                    View Books
                                </Button>
                            </div>
                        </Grid>

                        <Grid item xs={12} md={6} lg={4}>
                            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <AddCircleIcon className="text-4xl text-green-500 mb-4" />
                                <Typography variant="h5" className="mb-4 font-semibold">
                                    Add New Book
                                </Typography>
                                <Typography className="mb-4 text-gray-600">
                                    Add a new book to your collection
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => navigate('/add-book')}
                                    className="w-full"
                                >
                                    Add Book
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </div>

                <div className="text-center pb-8">
                    <Typography variant="body1" className="text-gray-600">
                        Keep track of your reading journey and organize your books efficiently
                    </Typography>
                </div>
            </Container>
        </div>
        </>
    );
};

export default Home;