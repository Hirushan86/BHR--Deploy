import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Typography, Grid, Box } from "@mui/material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";

const HomePage = () => {
  const location = useLocation();
  const username = location.state ? location.state.username : "";

  return (
    <div className="page-container">
    <Sidebar />
    <Navbar />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item md={6}>
            <img src="/images/favicon.png" alt="logo" />
          </Grid>
          <Grid item md={6}>
            <Typography variant="h4">Welcome, Admin!</Typography>
            <Box mt={3}>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
