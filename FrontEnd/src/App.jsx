import React from "react";
import "./App.css";
import Home from "./Pages/Home";
import {BrowserRouter, Route, Router, Routes } from "react-router-dom";
import MyBooks from "./Pages/MyBooks";
import AddBook from "./Pages/AddBook";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

const App = () => {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MyBooks" element={<MyBooks />} />
          <Route path="/AddBook" element={<AddBook />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  )
  
} 


export default App