import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    const API_URL = "http://localhost:5000/books";

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        axios
            .get(API_URL)
            .then((res) => {
                if (mounted) setBooks(res.data || []);
            })
            .catch((err) => {
                if (mounted) setError(err.response?.data?.message || err.message || "Error fetching books");
            })
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, [API_URL]);

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                    <Typography variant="h4" component="h1" className="font-semibold">
                        My Books
                    </Typography>
                </div>

                {loading ? (
                    <div className="flex justify-center mt-12">
                        <CircularProgress />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-center mt-8">{error}</div>
                ) : books.length === 0 ? (
                    <div className="text-center text-gray-600 mt-8">No books found.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => (
                            <Card key={book._id || book.id} className="flex flex-col h-full">
                                {book.coverUrl || book.image ? (
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image={book.coverUrl || book.image}
                                        alt={book.title}
                                    />
                                ) : (
                                    <div className="h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}

                                <CardContent className="flex flex-col flex-1">
                                    <Typography variant="h6" component="h2" className="mb-1">
                                        {book.title}
                                    </Typography>
                                    <Typography variant="subtitle2" color="textSecondary" className="mb-2">
                                        {book.author || "Unknown author"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        className="mb-4"
                                    >
                                        {book.description
                                            ? book.description.length > 140
                                                ? `${book.description.slice(0, 140)}...`
                                                : book.description
                                            : "No description available."}
                                    </Typography>

                                    <div className="mt-auto">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            href={book.infoLink || "#"}
                                            target={book.infoLink ? "_blank" : undefined}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyBooks;