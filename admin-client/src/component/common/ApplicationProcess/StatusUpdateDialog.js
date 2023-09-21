import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Notification from "../Notification/notification";




function StatusUpdateDialog({
  open,
  onClose,
  applicantId,
  attribute,

}) {

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

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value); // Update selectedStatus state
    console.log(event.target.value)
  };

  const handleUpdateStatus = async () => {
    try {
      const updatedStatus = selectedStatus;
      console.log(applicantId);
      console.log(attribute);
      console.log(updatedStatus);
      await axios.put(`${process.env.API_URL}/api/updateStatus/${applicantId}`, {
        updatedStatus,
        attribute,
      });

      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      // Handle error (e.g., show an error message to the user)
      showNotification("Status was not updated", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Status</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="status"
            name="status"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <FormControlLabel
              value="In Progress"
              control={<Radio />}
              label="In Progress"
            />
            <FormControlLabel
              value="Completed"
              control={<Radio />}
              label="Completed"
            />
            <FormControlLabel
              value="Failed"
              control={<Radio />}
              label="Failed"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdateStatus} color="primary">
          Update
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
}

export default StatusUpdateDialog;
