import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardContent className="p-6 flex flex-col gap-4">
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />

          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>Login</Button>
          <Typography align="center" className="text-sm text-gray-600">
            Don’t have an account? <span onClick={() => navigate("/signup")} className="text-blue-600 cursor-pointer">Signup</span>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
