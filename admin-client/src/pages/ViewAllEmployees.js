import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Container,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Card,
  CardContent,
  Box,
  Grid,
  Badge
} from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import { Link as RouterLink } from "react-router-dom";

const ViewAllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [allApplicants, setAllApplicants] = useState([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [expiredEmployees, setExpiredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployeesAndApplicants = async () => {
      try {
        const [empResponse, appResponse] = await Promise.all([
          axios.get("/api/employees"),
          axios.get("/api/applicants"),
        ]);

        setEmployees(empResponse.data);
        setAllApplicants(appResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployeesAndApplicants();
  }, []);

  const getFirstAidExpiration = (employeeEmail) => {
    const applicant = allApplicants.find((app) => app.email === employeeEmail);
    return applicant ? applicant.firstAidExpiration : "N/A";
  };

/*
  const filteredEmployees = employees.filter((employee) =>
    employee.firstName.toLowerCase().includes(searchFirstName.toLowerCase())
  );
  */

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4" gutterBottom>
          Current Employees
        </Typography>
        <Box mb={2}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchFirstName}
            onChange={(e) => setSearchFirstName(e.target.value)}
          />
        </Box>
        <Card elevation={3}>
          <CardContent>
            <TableContainer component={Paper}>
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>First Aid Expiry</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee._id}>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`/employeeDetails/employee/${employee._id}`}
                          color="primary"
                        >
                          {employee.firstName}
                        </Link>
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>
                        {
                          new Date(getFirstAidExpiration(employee.email)) < new Date() ?
                            (
                              <>
                                {getFirstAidExpiration(employee.email)}
                                <ErrorIcon color="error" />
                              </>
                            ) : (
                              getFirstAidExpiration(employee.email)
                            )
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ViewAllEmployees;
