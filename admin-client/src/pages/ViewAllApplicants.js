import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  TextField,
  InputAdornment,
  Link,
  Box,
  Grid,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import { Link as RouterLink } from "react-router-dom";
import UploadComponent from '../component/common/PDF Button/UploadComponent';


const ViewAllApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/applicants`);
        setApplicants(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchApplicants();
  }, []);

  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4" gutterBottom>
          Applicants
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
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
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
                    <TableCell>Application Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applicants.map((applicant) => (
                    <TableRow key={applicant._id}>
                      <TableCell>
                        <Link
                          component={RouterLink}
                          to={`/applicantDetails/applicant/${applicant._id}`}
                          color="primary"
                        >
                          {applicant.firstName} {applicant.lastName}
                        </Link>
                      </TableCell>
                      <TableCell>{applicant.email}</TableCell>
                      <TableCell>{applicant.applicationStatus}</TableCell>
                      <TableCell>
                    
                          <UploadComponent />
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

export default ViewAllApplicants;
