const ApplicantModel = require("../../../models/ApplicantModel");
const ErrorResponse = require("../../../utils/errorResponse");

// Function to add a new applicant
exports.addApplicant = async (req, res, next) => {
  try {
    const applicantData = req.body;

    // Check if an applicant with the same email already exists
    const applicantExists = await ApplicantModel.findOne({ email: applicantData.email });
    if (applicantExists) {
      return next(new ErrorResponse("An applicant with that email already exists", 400));
    }

    // Create a new applicant using the ApplicantModel
    const newApplicant = await ApplicantModel.create(applicantData);

    res.status(201).json({
      success: true,
      applicant: newApplicant,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

