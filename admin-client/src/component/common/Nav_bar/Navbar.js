import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/MenuBookOutlined';
import IconButton from '@mui/material/IconButton';
import { Drawer, Typography, Button } from '@mui/material';
import Sidebar from "../Side_bar/SideBar";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { signOut } = useAuth(); //signOut function from AuthContext

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleSignOut = () => {
      signOut();
      navigate("/sign-in");
    };
  return (
    <div className="main-container">
      <nav>
        <AppBar position="fixed" sx={{ backgroundColor: "#2196F3" }}>
          <Toolbar>
            {/* Menu button to open/close the sidebar */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/home"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                color: "white",
              }}
            >
              Belle Babysitters - Admin
            </Typography>

            {/* Add other navigation elements here */}
            { (
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  Dashboard
                </Typography>
                <Typography
                  variant="body2"
                  component={Link}
                  to="/users"
                  sx={{
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  Users
                </Typography>
                {/* Add more links for admin functionality */}
              </div>
            )}
            {/* Sign Out Button */}
            <Button
              color="inherit"
              onClick={handleSignOut}
              sx={{
                marginLeft: '10px', // Adjust the spacing as needed
              }}
            >
              Sign Out
            </Button>
          </Toolbar>
        </AppBar>
      </nav>
      <Drawer open={open} onClose={handleDrawerClose}>
        {/* Include your Sidebar component here */}
        <Sidebar />
      </Drawer>
      <div className="content">
        {/* Your content components go here */}
      </div>
    </div>
  );
};

export default Navbar;
