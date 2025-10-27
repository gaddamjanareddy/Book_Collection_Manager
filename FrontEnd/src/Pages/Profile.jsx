import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    username: "",
    email: "",
    role: "",
  });

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        const res = await axios.get("http://localhost:5000/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUserData();
  }, [navigate]);

  if (!user) return <div className="text-center p-4">Loading...</div>;

  // Prefill form
  const handleEditProfile = () => {
    setUpdatedData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setUpdateDialogOpen(true);
  };

  // Input change
  const handleInputChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = {
        username: updatedData.username,
        email: updatedData.email,
      };

      // Only allow role change if allowed
      if (user.role === "super_admin") payload.role = updatedData.role;
      if (user.role === "admin" && ["admin", "student"].includes(updatedData.role)) {
        payload.role = updatedData.role;
      }

      const res = await axios.put("http://localhost:5000/users/profile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ title: "Success", text: "Profile updated successfully!", icon: "success" });

      setUser(res.data);
      setUpdateDialogOpen(false);
    } catch (err) {
      console.error(Swal.fire({ title: "Error", text: "Failed to update profile.", icon: "error" }), err);
      Swal.fire({ title: "Error", text: err.response?.data?.message || "Error updating profile", icon: "error" });
    }
  };

  // Logout
   const handleLogout = () => {
    Swal.fire({
    title: "Do You Want To Logout?",
    text: "You will be redirected to the login page.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout me!"
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Logged Out!",
        text: "You have been logged out successfully.",
        icon: "success"
      }).then(() => {
        localStorage.removeItem("token");
        navigate("/login");
        setDrawerOpen(false);
      });
      
    }
  });
  };

  // Role options
  const roleOptions = () => {
    if (user.role === "super_admin") return ["super_admin", "admin", "student"];
    if (user.role === "admin") return ["admin", "student"];
    return ["student"];
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg relative">
        {/* Back Button */}
      <div className="flex justify-between ">
          <IconButton
          onClick={() => navigate(-1)}
          className="absolute top-2 left-2"
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
        

        {/* Logout Button */}
        <IconButton
          onClick={handleLogout}
          className="absolute top-2 right-2"
          color="error"
        >
          <LogoutIcon />
        </IconButton>
        </div>

        <div className="flex justify-center mt-6">
          <Avatar className="w-24 h-24" >{user.username.charAt(0).toUpperCase()}</Avatar>
        </div>

        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {`${user.role.toUpperCase()} PROFILE`}
          </Typography>

          <div className="flex flex-col gap-2 mt-4">
            <Typography variant="h6" color="text.secondary">
              Name: {user.username}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Role: {user.role}
            </Typography>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outlined" color="primary" onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button variant="outlined" color="error" disabled={true}>
              Change Password
            </Button>
          </div>
        </CardContent>

        {/* Edit Dialog */}
        <Dialog
          open={updateDialogOpen}
          onClose={() => setUpdateDialogOpen(false)}
          fullWidth
        >
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent className="flex flex-col gap-4 mt-2">
            <TextField
              label="Name"
              name="username"
              value={updatedData.username}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={updatedData.email}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Role"
              name="role"
              value={updatedData.role}
              onChange={handleInputChange}
              select
              fullWidth
              disabled={user.role === "student"} // student cannot edit role
            >
              {roleOptions().map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="body2" color="text.secondary">
              <span>Note:</span> Only admins and super_admins can change roles.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleUpdateProfile}
              variant="contained"
              color="primary"
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
};

export default Profile;
