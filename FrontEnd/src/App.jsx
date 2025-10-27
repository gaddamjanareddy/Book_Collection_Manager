import React, { useState } from "react";
import "./App.css";
import Home from "./Pages/Home";
import MyBooks from "./Pages/MyBooks";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ViewBook from "./Pages/View";
import Profile from "./Pages/Profile";
import Navbar from "./Components/Navbar";
import AddBookModal from "./Components/AddBookModal";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

const App = () => {
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);
  const [booksList, setBooksList] = useState([]);
  const location = useLocation();

  const handleAddBookToList = (book) => {
    setBooksList((prev) => [book, ...prev]);
  };

  // Pages where Navbar should be hidden
  const noNavbarPaths = ["/login", "/signup", "/Profile"];
  const showNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && (
        <Navbar openAddBookModal={() => setAddBookModalOpen(true)} />
      )}

      <AddBookModal
        open={addBookModalOpen}
        handleClose={() => setAddBookModalOpen(false)}
        handleAddBook={handleAddBookToList}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              booksList={booksList}
              openAddBookModal={() => setAddBookModalOpen(true)}
            />
          }
        />
        <Route
          path="/MyBooks"
          element={<MyBooks booksList={booksList} setBooksList={setBooksList} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-details/:id" element={<ViewBook />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default AppWrapper;
