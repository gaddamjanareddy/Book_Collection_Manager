import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await axios.post("http://localhost:5000/auth/login", formData);
      console.log("Getting:", res.data);
      
      if (!res.data.token) {
        setError("No token received");
        return;
      }
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      
      if(res.data.role === "admin" || res.data.role === "student"){
        Swal.fire({
          title: "Login Successful!",
          text: `Welcome!`,
          footer: `redirecting to ${res.data.role} dashboard...`,
          icon: "success"
          });
        navigate("/");
        
      }
      // navigate("/")
      return;
    } catch (err) {
      console.error(err.response?.data || err.message);
          setError(err.response?.data?.error || err.response?.data?.message || 
          "Login failed. Please check your credentials and try again.");
          console.log("GettingError:", err);
          
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-96 shadow-lg">
        <CardContent className="p-6 flex flex-col gap-4">
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
            Login
          </Button>

          <Typography align="center" className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")} className="text-blue-600 cursor-pointer">
              Signup
            </span>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
