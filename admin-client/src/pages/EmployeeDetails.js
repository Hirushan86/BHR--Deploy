import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
} from "@mui/material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";

const EmployeeDetails = () => {
  const { employeeId } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [allApplicants, setAllApplicants] = useState([]);
  const [isEditingPoliceExpiryDate, setIsEditingPoliceExpiryDate] = useState(false);



  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(
          `/api/employeesDetails/employee/${employeeId}`
        );
        setEmployeeDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("/api/applicants");
        setAllApplicants(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplicants();
  }, []);


  const getFirstAidExpiration = (employeeEmail) => {
    const applicant = allApplicants.find((app) => app.email === employeeEmail);
    return applicant ? applicant.firstAidExpiration : "N/A";
  };

  const handleSendEmail = (email) => {
    const subject = "First Aid Certification Reminder";
    const body = `Dear ${employeeDetails.firstName},

Your First Aid certification has expired. Please consider renewing your certificate within the upcoming three months to avoid having to retake the entire course. Should you neglect to renew this certificate, your position as a Primary Babysitter will be temporarily relegated to that of a backup babysitter.


Regards,
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };



  const handleRoleChange = (userId, newRole) => {
    axios.put(`/api/setUser${newRole === 'active' ? 'Active' : 'Inactive'}/${userId}`)
      .then(response => {
        setEmployeeDetails(prevDetails => ({
          ...prevDetails,
          role: newRole
        }));
      })
      .catch(error => {
        console.error('Error updating user role:', error);
        alert('Failed to update user status. Please try again.');
      });
  }


  const handleStatusChange = () => {
    const newRole = employeeDetails.role === 'active' ? 'inactive' : 'active';
    handleRoleChange(employeeId, newRole);
  }



  const updatePoliceExpiryDate = () => {
    axios.put(`/api/employeesDetails/employee/${employeeId}/policeExpiryDate`, {
      policeExpiryDate: employeeDetails.policeExpiryDate
    })
      .then(response => {
        console.log("Successfully updated police expiry date");
        setIsEditingPoliceExpiryDate(false); // Set the editing to false once updated
      })
      .catch(error => {
        console.error('Error updating police expiry date:', error);
      });
  };


  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />

      <Container style={{ marginRight: "40px" }} maxWidth="lg">
        <Typography variant="h4">Employee Details</Typography>
        <Paper elevation={3}>
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Name:</TableCell>
                  <TableCell>{employeeDetails.firstName} {employeeDetails.lastName}</TableCell>
                  <TableCell></TableCell> {/* Additional TableCell for alignment */}
                </TableRow>
                <TableRow>
                  <TableCell>Email: </TableCell>
                  <TableCell>{employeeDetails.email}</TableCell>
                  <TableCell></TableCell> {/* Additional TableCell for alignment */}
                </TableRow>
                <TableRow>
                  <TableCell> First Aid Expiry: </TableCell>
                  <TableCell>{getFirstAidExpiration(employeeDetails.email)}</TableCell>
                  <TableCell>
                    {
                      new Date(getFirstAidExpiration(employeeDetails.email)) < new Date() ?
                        (<Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleSendEmail(employeeDetails.email)}  >
                          First Aid Expired - Send Email Reminder
                        </Button>
                        ) : null}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell> Police Check Expiry: </TableCell>
                  <TableCell>
                    {
                      isEditingPoliceExpiryDate ? (
                        <TextField
                          type="date"
                          size="small"
                          value={employeeDetails.policeExpiryDate || ''}
                          onChange={(e) => {
                            const updatedDate = e.target.value;
                            setEmployeeDetails((prevDetails) => ({
                              ...prevDetails,
                              policeExpiryDate: updatedDate
                            }));
                          }}
                        />
                      ) : (
                        <>
                          {employeeDetails.policeExpiryDate}
                          <Button
                            size="small"
                            style={{ marginLeft: '10px' }}
                            variant="text"
                            disableElevation
                            color="primary"
                            onClick={() => setIsEditingPoliceExpiryDate(true)}>Edit</Button>
                        </>
                      )
                    }
                  </TableCell>
                  <TableCell>
                    {
                      isEditingPoliceExpiryDate && (
                        <Button
                          size="small"
                          variant="contained"
                          disableElevation
                          color="primary"
                          onClick={updatePoliceExpiryDate}>
                          Update Expiry Date
                        </Button>
                      )
                    }
                  </TableCell>
                </TableRow>

                {/* Need to add more */}
                <TableRow>
                  <TableCell>
                    ----- INSERT MORE DETAILS IF NEEDED ---------
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      onClick={handleStatusChange}
                    >
                      Set {employeeDetails.role === 'active' ? 'Inactive' : 'Active'}
                    </Button> </TableCell>
                  <TableCell></TableCell> {/* Additional TableCell for alignment */}
                </TableRow>
              </TableBody>
            </Table>

          </TableContainer>
        </Paper>

      </Container>
    </div>
  );
};

export default EmployeeDetails;



