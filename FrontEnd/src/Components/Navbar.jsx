import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      className="flex bg-gradient-to-r from-blue-600 to-blue-800"
    >
      <Toolbar className="flex justify-between items-center px-4">
        <Typography
          variant="h6"
          className="font-bold text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          Book Collection
        </Typography>

        <div className="flex items-center space-x-6">
          <ListItem
            button
            className="hover:bg-blue-700 rounded-lg"
            onClick={() => navigate("/")}
          >
            <ListItemText primary="Home" className="text-white" />
          </ListItem>

          {token ? (
            <>
              <ListItem
                button
                className="hover:bg-blue-700 rounded-lg"
                onClick={() => navigate("/MyBooks")}
              >
                <ListItemText primary="My Books" className="text-white" />
              </ListItem>

              <ListItem
                button
                className="hover:bg-blue-700 rounded-lg"
                onClick={() => navigate("/AddBook")}
              >
                <ListItemText primary="Add Book" className="text-white" />
              </ListItem>

              <ListItem
                button
                className="hover:bg-blue-700 rounded-lg"
                onClick={handleLogout}
              >
                <ListItemText primary="Logout" className="text-white" />
              </ListItem>

              <Avatar
                alt="User"
                className="ml-4 cursor-pointer hover:opacity-80"
              />
            </>
          ) : (
            <>
              <ListItem
                button
                className="hover:bg-blue-700 rounded-lg"
                onClick={() => navigate("/login")}
              >
                <ListItemText primary="Login" className="text-white" />
              </ListItem>
              <ListItem
                button
                className="hover:bg-blue-700 rounded-lg"
                onClick={() => navigate("/signup")}
              >
                <ListItemText primary="Signup" className="text-white" />
              </ListItem>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
