import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import Notification from "../component/common/Notification/notification";

const PageWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;
height: 100vh;
`;

const FormWrapper = styled.form`
display: flex;
flex-direction: column;
gap: 1rem;
max-width: 400px;
margin: 0 auto;
`;


const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("info");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const showNotification = (message, severity) => {
    setNotificationMessage(message);
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showNotification("Please fill out all fields", "error");
      return;
    }

    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      showNotification("Enter a valid email address", "error");
      return;
    }

    try {
      const { data } = await axios.post(`/api/signIn`, {
        email,
        password,
      });

      console.log(data);
      
      if (data.isAdmin === true) {
        console.log(data.token);

        localStorage.setItem('userToken', data.token);

        signIn(email, password, navigate);
      } else {
        // Display an error message for user that isn't an admin
        showNotification("Unauthorised access", "error");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        // Check response and data properties are available
        if (err.response.status === 401) {
          // Unauthorized access, display a specific error message
          showNotification("Unauthorized access", "error");
        } else {
          // Display the error message from the server response
          showNotification(err.response.data.error, "error");
        }
      } else {
        // Handle other types of errors without response data
        console.error("An error occurred:", err);
        showNotification("An error occurred during sign in.", "error");
      }
      // Clear the email and password input
      /*setEmail("");
      setPassword("");*/
    }
  };

  
  return (
    <PageWrapper>
      <FormWrapper onSubmit={handleSubmit}>
        <img src="/images/logoText.png" alt="logo" />
        <Typography variant="h6">Admin Sign In</Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Sign In
        </Button>
      </FormWrapper>
      <Notification
        open={notificationOpen}
        message={notificationMessage}
        severity={notificationSeverity}
        onClose={handleNotificationClose}
      />
    </PageWrapper>
  );
};

export default SignIn;
