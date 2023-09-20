import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Notification from "../Notification/notification";

const ScheduleDialog = ({ open, onClose, scheduleType, applicantId }) => {
  const [link, setLink] = useState(""); // State to store the link input

const [selectedStatus, setSelectedStatus] = useState("InProgress");
const [notificationOpen, setNotificationOpen] = useState(false);
const [notificationMessage, setNotificationMessage] = useState("");
const [notificationSeverity, setNotificationSeverity] = useState("info");

const showNotification = (message, severity) => {
  setNotificationMessage(message);
  setNotificationSeverity(severity);
  setNotificationOpen(true);
  };

const handleNotificationClose = () => {
    setNotificationOpen(false);
  };


  const handleSend = async () => {
    try {
      // Define your API endpoint and the data you want to send
      // (modify this according to your backend requirements)
      const endpoint = "/api/schedule${scheduleType}/${applicantId}";
      const data = { interviewLink: link }; // example payload
      
      await axios.post(endpoint, data);

    onClose();

    showNotification("Link sent successfully", "success");
    
  } catch (error) {
    console.error("Error sending link:", error);
    // Handle error (e.g., show an error message to the user)
    showNotification("Failed to send link", "error");
  }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule {scheduleType} Interview</DialogTitle>
      <DialogContent>
        <TextField
          label="Schedule Link"
          fullWidth
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSend} color="primary">
          Send
        </Button>
      </DialogActions>
      
      <Notification
      open={notificationOpen}
      message={notificationMessage}
      severity={notificationSeverity}
      onClose={handleNotificationClose}
      />

    </Dialog>
  );
};

export default ScheduleDialog;
