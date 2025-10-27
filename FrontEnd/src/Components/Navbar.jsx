import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { amber } from "@mui/material/colors";
import Swal from 'sweetalert2'


const Navbar = ({ openAddBookModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = localStorage.getItem("role");

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
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white font-bold rounded-lg"
      : "hover:bg-white rounded-lg";

  // Desktop links
  const links = token
    ? [
        { name: "Home", path: "/" },
        { name: "My Books", path: "/MyBooks" },
        { name: "Add Book", path: "/add-book", action: openAddBookModal },
        { name: "Logout", path: "/logout", action: handleLogout },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Login", path: "/login" },
        { name: "Signup", path: "/signup" },
      ];

  // Mobile drawer links include profile as a link
  const drawerLinks = token
    ? [
        ...links.filter((l) => l.name !== "Logout"), 
        { name: "Profile", path: "/Profile", action: () => navigate("/Profile") },
        { name: "Logout", path: "/logout", action: handleLogout },
      ]
    : links;

  const handleLinkClick = (link) => {
    if (link.action) {
      link.action();
    } else {
      navigate(link.path);
      setDrawerOpen(false);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: amber[300], color: "black" }}>
        <Toolbar className="flex justify-between items-center px-10">
          <Typography
            variant="h6"
            className="font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            Book Collection
          </Typography>

          {/* Desktop Links + Avatar */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <ListItem
                key={link.name}
                button
                className={`cursor-pointer ${isActive(link.path)}`}
                onClick={() => handleLinkClick(link)}
              >
                <ListItemText primary={link.name} primaryTypographyProps={{ noWrap: true }} />
              </ListItem>
            ))}

            {/* Desktop Avatar */}
            {token && (
              <Avatar
                alt="User"
                className="ml-4 cursor-pointer hover:opacity-80"
                onClick={() => navigate("/Profile")}
              > {role == "student" ? "S" : role == "admin" ? "A" : role == "super_admin" ? "SA" : ""}
              </Avatar>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden">
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List className="w-64 p-4">
          {drawerLinks.map((link) => (
            <ListItem
              key={link.name}
              button
              className={`cursor-pointer text-black py-3 px-2 ${isActive(link.path)}`}
              onClick={() => handleLinkClick(link)}
            >
              <ListItemText primary={link.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
