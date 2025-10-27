import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    year: "",
    genre: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
      setSuccess("Book added successfully.");
      setForm({ title: "", author: "", description: "", year: "", genre: "" });

      setTimeout(() => navigate("/mybooks"), 1000);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center flex-col p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">Add Book</h1>

        <form onSubmit={handleSubmit}>
         <label className="block mb-3">
            Image URL
            <input
              type="url"
              name="coverUrl"
              value={form.coverUrl}
              onChange={handleChange}
              required
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>
          <label className="block mb-3">
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>

          <label className="block mb-3">
            Author
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
              required
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>

          <label className="block mb-3">
            Year
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              type="number"
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>

          <label className="block mb-3">
            Genre
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>

          <label className="block mb-3">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="block w-full border border-gray-400 rounded p-2"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-3 w-full"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>
    </>
  );
};

export default AddBook;
