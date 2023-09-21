// ApplicantDetails.js
import React, { useEffect, useState } from "react";
import { Document, Page } from 'react-pdf';
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
  IconButton,
  Button,
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import Navbar from "../component/common/Nav_bar/Navbar";
import Sidebar from "../component/common/Side_bar/SideBar";
import StatusUpdateDialog from "../component/common/ApplicationProcess/StatusUpdateDialog";
import ScheduleDialog from "../component/common/ApplicationProcess/ScheduleDialog";
import UploadFileDialog from "../component/common/ApplicationProcess/UploadFileDialog";
import PDFViewDialog from "../component/common/ApplicationProcess/PDFViewDialog";


const updateApplicantAttribute = (applicantId, attributeName, attributeValue) => {
  fetch(`${apiUrl}/updateApplicantAttribute/${applicantId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      attributeName: attributeName,
      attributeValue: attributeValue
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data); // This will be the updated applicant
      // Maybe update your state or UI based on the response
    })
    .catch(error => {
      console.error('Error updating attribute:', error);
    });
};



const ApplicantDetails = () => {
  const { applicantId } = useParams();
  const [applicantDetails, setApplicantDetails] = useState({});
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [firstTableData, setFirstTableData] = useState([])
  const [isSecondTableExpanded, setIsSecondTableExpanded] = useState(false);
  const [secondTableData, setSecondTableData] = useState([]);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openPDFViewDialog, setOpenPDFViewDialog] = useState(false);
  const [pdfContent, setPdfContent] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("InProgress");
  const [uploadDialogAttribute, setUploadDialogAttribute] = useState(null);
  const [statusDialogAttribute, setStatusDialogAttribute] = useState(null);
  const [openDialogRowIndex, setOpenDialogRowIndex] = useState(-1);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/api/applicantsDetails/applicant/${applicantId}`);
        setApplicantDetails(response.data);

        const formattedFirstTableData = [
          { question: "Name", answer: `${response.data.firstName} ${response.data.middleName} ${response.data.lastName}` },
          { question: "Email", answer: response.data.email },
          { question: "Cellphone", answer: response.data.cellphone },
          { question: "landline ", answer: response.data.landline },
          { question: "Age ", answer: response.data.age },
          { question: "Drivers License ", answer: response.data.driversLicense },
          { question: "Access To Car ", answer: response.data.accessToCar },
          { question: "Access To Car Explained ", answer: response.data.accessToCarOther },
          { question: "First Aid ", answer: response.data.firstAid },
          { question: "First Aid Expiration ", answer: response.data.firstAidExpiration },
          { question: "Criminal Convictions ", answer: response.data.criminalConvictions },
          { question: "Criminal Convictions Explain ", answer: response.data.criminalConvictionsExplain },
          { question: "Police Check ", answer: response.data.policeCheck },
          { question: "Police Check Explain ", answer: response.data.policeCheckOther },
          { question: "Dunedin Stay ", answer: response.data.dunedinStay },
          { question: "Dunedin Stay Other ", answer: response.data.dunedinStayOther },
          { question: "Summer Period ", answer: response.data.summerPeriod },
          { question: "Summer Period Explain ", answer: response.data.summerPeriodOther },
          { question: "Permanent Residence ", answer: response.data.permanentResidence },
          { question: "Dunedin Arrival Date ", answer: response.data.dunedinArrivalDate },
          { question: "Avaliable to Start Work ", answer: response.data.startWork },
          { question: "Amount Of Work ", answer: response.data.amountOfWork },
          { question: "Amount Of Work Explain ", answer: response.data.amountOfWorkOther },
          { question: "Regular Shifts ", answer: response.data.regularShifts },
          { question: "Regular Shifts Other ", answer: response.data.regularShiftsOther },
          { question: "Current Work Status ", answer: response.data.currentWorkStatus },
          { question: "Referees ", answer: response.data.referees },
          { question: "Referees Other ", answer: response.data.refereesOther },
          { question: "Referee Information ", answer: response.data.refereeInformation },
          { question: "Cover Letter ", answer: response.data.coverLetter },
          { question: "Curriculum Vitae ", answer: response.data.curriculumVitae },
        ];

        setFirstTableData(formattedFirstTableData);

        //Note the names after response.data. - they are what are needed to be added to the schema
        const formattedSecondTableData = [
          { question: "Application Status", answer: response.data.applicationStatus },
          { question: "Phone Interview", answer: response.data.phoneInterviewStatus },
          { question: "Additional Information", answer: response.data.additionalInformationStatus },
          { question: "Face-to-Face Interview", answer: response.data.faceToFaceInterviewStatus },
          { question: "Police Check", answer: response.data.policeCheckStatus },
          { question: "Reference Check", answer: response.data.referenceCheckStatus },
          { question: "Schedule Induction", answer: response.data.inductionStatus },
          { question: "Issued with Equipment", answer: response.data.equipmentStatus }
        ];

        setSecondTableData(formattedSecondTableData);


      } catch (error) {
        console.log(error);
      }
    };

    if (shouldRefreshData || applicantId) {
      fetchApplicantDetails();
    }
  
    // Reset shouldRefreshData to false after data refresh
    if (shouldRefreshData) {
      setShouldRefreshData(false);
    }
  }, [applicantId, shouldRefreshData]);

  //For the expansion of the tables
  const toggleTable = () => {
    setIsTableExpanded(!isTableExpanded);
  };

  const toggleSecondTable = () => {
    setIsSecondTableExpanded(!isSecondTableExpanded);
  };

  //For the status update dialog box
  const handleOpenDialog = (question) => {
    let attribute = "";

    if (question === "Application Status") {
      attribute = "applicationStatus";
    } else if (question === "Phone Interview") {
      attribute = "phoneInterviewStatus";
    } else if (question === "Additional Information") {
      attribute = "additionalInformationStatus";
    } else if (question === "Face-to-Face Interview") {
      attribute = "faceToFaceInterviewStatus";
    } else if (question === "Police Check") {
      attribute = "policeCheckStatus";
    }else if (question === "Reference Check") {
      attribute = "referenceCheckStatus";
    }else if (question === "Schedule Induction") {
      attribute = "inductionStatus";
    }else if (question === "Issued with Equipment") {
      attribute = "equipmentStatus";
    }

  // Set the attribute and log it
  setStatusDialogAttribute(attribute);
  setOpenDialogRowIndex(true);
};

  const handleCloseDialog = () => {
    setStatusDialogAttribute(null);
    setOpenDialogRowIndex(-1);
    setShouldRefreshData(true);
  };

  //Saro - Determining which interview we are scheduling for
  const [openPhoneInterviewSchedule, setOpenPhoneInterviewSchedule] = useState(false);
  const [openInductionSchedule, setOpenInductionSchedule] = useState(false);

  //For the schedule dialog box - Saro edited
  const handleOpenScheduleDialog = (scheduleType) => {
    if (scheduleType === "phoneInterviewSchdule") {
      setOpenPhoneInterviewSchedule(true);
    } else if (scheduleType === "inductionSchedule") {
      setOpenInductionSchedule(true);
    }
    setOpenScheduleDialog(true);
  };

  const handleCloseScheduleDialog = () => {
    setOpenScheduleDialog(false);
  };

  



  //For the upload file document
  const handleOpenUploadDialog = (question) => {
    let attribute = "";

    if (question === "Phone Interview") {
      attribute = "phoneInterviewStatus";
    } else if (question === "Additional Information") {
      attribute = "additionalInformationStatus";
    } else if (question === "Face-to-Face Interview") {
      attribute = "faceToFaceInterviewStatus";
    }
    
    setUploadDialogAttribute(attribute);
    console.log(uploadDialogAttribute);

    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setUploadDialogAttribute(null);
  };



  //For the view PDF button
  const handleOpenPDFViewDialog = () => {
    setOpenPDFViewDialog(true);
  };

  const handleClosePDFViewDialog = () => {
    setOpenPDFViewDialog(false);
  };

//Pre-warning phone interview email
const handlePhoneInterviewEmail = (email) => {
  const subject = "Phone Interview Scheduling";
  const body = `Hi ${applicantDetails.firstName},

This email is just a heads up that I will be doing some phone interview phone calling in the coming few days.

This will be relatively casual - let us know if you are aware of any particular times that will not work for you.


Regards,
Belle Babysitting`;

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};

//Induction email
  const handleInductionEmail = (email) => {
    const subject = "Induction Scheduling";
    const body = `Hi ${applicantDetails.firstName},

This is your email for inductions


Kind Regards,
Administration (Annabelle & Charlotte),
Belle Babysitters Ltd.

Call: 0800 235532 (BELLEB)
Text: 0225 235532 (BELLEB)
Website: http://www.bellebabysitters.co.nz 
Facebook: https://www.facebook.com/belle.babysitters 
Twitter: https://twitter.com/bellebabysitter
Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

//Zoom interview email
  const handleSendFaceInterviewEmail = (email) => {
    const subject = "Zoom Interview Invitation";
    const body = `Hi ${applicantDetails.firstName},

  Lovely to speak with you today. Here are the two links you need before the next step of our process, the Face to Face (Zoom) interview. This first one should allow you to select a 45minute time slot out of out currently available slots. If none of them suit for whatever reason you will need to let us know.

  https://calendly.com/bellebabysitters/45-minute-face-to-face-interview 

  This next one should take you to the form I mentioned that you need to read and submit further information to us. There is one small correction, that is the general pay rate is now starting at $26 per hour and the public holiday/short notice rate is $26 - $30 per hour (We are in the process of correcting this error). Please complete this form prior to your scheduled interview time slot.

  https://www.emailmeform.com/builder/form/Rez6ets2NC 


  Please email/text if you have any issues (I know it’s a bit clunky, it’s our first attempt at Covid proofing our recruitment process).

  Kind regards,

  Administration (Annabelle & Charlotte),
  Belle Babysitters Ltd.

  Call: 0800 235532 (BELLEB)
  Text: 0225 235532 (BELLEB)
  Website: http://www.bellebabysitters.co.nz 
  Facebook: https://www.facebook.com/belle.babysitters 
  Twitter: https://twitter.com/bellebabysitter

  This is your email for inductions


  Regards,
  Belle Babysitting`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

//Induction email
const handleSendConfirmationEmail = (email) => {
  const subject = "Zoom Interview Confirmation";
  const body = `Hi ${applicantDetails.firstName},

  Please complete the form at the following link prior to your scheduled interview time slot of TIMEa/pm DAY DATE MONTH.
  
  https://www.emailmeform.com/builder/form/Rez6ets2NC 
  
  
  Kind Regards,
  
  Administration (Annabelle & Charlotte),
  Belle Babysitters Ltd.
  
  Call: 0800 235532 (BELLEB)
  Text: 0225 235532 (BELLEB)
  Website: http://www.bellebabysitters.co.nz
  Facebook: https://www.facebook.com/belle.babysitters
  Twitter: https://twitter.com/bellebabysitter`;

  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
};

  //To show custom buttons in each row of the application process table
  const renderButtonsForRow = (question) => {

    switch (question) {
      case "Application Status":
      case "Police Check":
      case "Reference Check":
      case "Issued with Equipment":
        return <Button onClick={() => handleOpenDialog(question)}> Update </Button>
      case "Phone Interview":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Update </Button>
            <Button onClick={() => handlePhoneInterviewEmail(applicantDetails.email)}>Schedule</Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>Add</Button>
            <Button onClick={handleOpenPDFViewDialog}>View Notes</Button>
          </>
        );
      case "Face-to-Face Interview":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Update </Button>
            <Button onClick={() => handleSendFaceInterviewEmail(applicantDetails.email)}>Schedule</Button>
            <Button onClick={() => handleSendConfirmationEmail(applicantDetails.email)}>Send Confirmation</Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>Add</Button>
            <Button onClick={handleOpenPDFViewDialog}>View Notes</Button>
          </>
        );
      case "Additional Information":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Update </Button>
            <Button>Request</Button>
            <Button onClick={() => handleOpenUploadDialog(question)}>Add</Button>
            <Button onClick={handleOpenPDFViewDialog}>View</Button>
          </>
        );
      case "Schedule Induction":
        return (
          <>
            <Button onClick={() => handleOpenDialog(question)}> Update </Button>
            <Button onClick={() => handleInductionEmail(applicantDetails.email)}>Schedule</Button>
          </>
        )
    }
  };



  return (
    <div className="page-container">
      <Sidebar />
      <Navbar />
      <Container style={{ marginRight: "40px" }}>
        <Typography variant="h4">Applicant Details</Typography>

        <TableContainer component={Paper} style={{ marginTop: "20px" }}>

          <Table>
            <TableBody>
              {firstTableData.slice(0, isTableExpanded ? firstTableData.length : 3).map((row) => (
                <TableRow key={row.question}>
                  <TableCell>{row.question}</TableCell>
                  <TableCell>{row.answer}</TableCell>
                </TableRow>
              ))}

              {isTableExpanded &&
                firstTableData.slice(31).map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TableCell align="center" colSpan={2}>
            <IconButton onClick={toggleTable}>
              {isTableExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          </TableCell>

        </TableContainer>


        <Typography variant="h4" style={{ marginTop: "30px" }} >Application Process</Typography>

        <TableContainer component={Paper} style={{ marginTop: "10px" }} >

          <Table>
            <TableBody>
              {secondTableData.slice(0, isSecondTableExpanded ? secondTableData.length : 3).map((row) => (
                <TableRow key={row.question}>
                  <TableCell>{row.question}</TableCell>
                  <TableCell>{row.answer}</TableCell>
                  <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                </TableRow>
              ))}


              {isSecondTableExpanded &&
                secondTableData.slice(9).map((row) => (
                  <TableRow key={row.question}>
                    <TableCell>{row.question}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{renderButtonsForRow(row.question)}</TableCell>
                  </TableRow>
                ))}

              <StatusUpdateDialog
                open={openDialogRowIndex !== -1}
                onClose={handleCloseDialog}
                applicantId={applicantId}
                attribute={statusDialogAttribute}
                setSelectedStatus={setSelectedStatus}
              />

              <ScheduleDialog
                open={openScheduleDialog}
                onClose={handleCloseScheduleDialog}
                selectedStatus={selectedStatus}
              />

              <UploadFileDialog
                open={openUploadDialog}
                onClose={handleCloseUploadDialog}
                applicantId={applicantId}
                attribute={uploadDialogAttribute}
              />

              <PDFViewDialog
                open={openPDFViewDialog}
                onClose={handleClosePDFViewDialog}

              >
                <Document file={pdfContent}>
                  <Page pageNumber={1} />
                </Document>
              </PDFViewDialog>

              <TableRow>
                <TableCell colSpan={2}>
                  <IconButton onClick={toggleSecondTable}>
                    {isSecondTableExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </div>
  );
}

export default ApplicantDetails;



