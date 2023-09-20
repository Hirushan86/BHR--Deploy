const jwt = require("jsonwebtoken");
const User = require("../../models/UserModel");
const Applicant = require("../../models/ApplicantModel");
const ErrorResponse = require("../../utils/errorResponse");

const generateToken = async (user, statusCode, res) => {
  const token = await user.jwtGenerateToken();
  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + process.env.EXPIRE_TOKEN), // Expire token = 1hr
  };

  // Create the token with the payload containing only the user's id
  const signedToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Set the token as a cookie
  res
    .status(statusCode)
    .cookie("token", signedToken, options)
    .json({ success: true, token: signedToken });
};

//SIGN UP
exports.signUp = async (req, res, next) => {
  const { email } = req.body;

  // Check if a user with the same email exists
  const userExists = await User.findOne({ email });

  // Email needs to be unique
  if (userExists) {
    return next(
      new ErrorResponse(
        "An account has already been registered with that email",
        400
      )
    );
  }

  try {
    // Find existing applicant using email address
    const existingApplicant = await Applicant.findOne({
      email: req.body.email,
    });

    if (!existingApplicant) {
      return next(
        new ErrorResponse("No application found for this email address", 404)
      );
    }

    // create and link user to their applicantId
    const userData = {
      applicantId: existingApplicant._id, //existing applicant
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

//SIGN IN
exports.signIn = async (req, res, next) => {
  let token;

  try {
    const { email, password } = req.body;

    // Check if user hasn't entered an email/password
    if (!email || !password) {
      return next(
        new ErrorResponse(
          "Please enter your Email and Password to sign in",
          400
        )
      );
    }

    // Check email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid Email address", 400));
    }

    // Verify user password
    const isMatched = await user.comparePassword(password);

    // Check if passwords don't match the database one
    if (!isMatched) {
      return next(new ErrorResponse("Incorrect password", 400));
    }

    // Determine if the user is an admin
    const isAdmin = user.isAdmin;

    // Generate token with only the user's id
    token = await user.jwtGenerateToken(); // Assign the token here

    // Set the token as a cookie and send it in the response
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + Number(process.env.EXPIRE_TOKEN)), // Expire token = 1hr
    };

    // Set the token as a cookie
    res
      .status(200)
      .cookie("token", token, options)
      .json({ success: true, isAdmin: user.isAdmin, token }); 

    console.log("User is admin:", isAdmin);
  } catch (error) {
    console.log(error);
    next(
      new ErrorResponse("Cannot log in, please check your credentials", 400)
    );
  }
};

//RETRIEVING USER DETAILS
exports.getUserInfo = async (req, res, next) => {
  try {
    // Fetch user information based on the user ID from the request object
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the user information
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//SIGN OUT USER
exports.signOut = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Sign out successful",
  });
};

// Setting a user to inactive
exports.updUserInactive = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { role: "inactive" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User set to inactive", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Setting a user to active
exports.updUserActive = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { role: "active" },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User set to active", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

//Getting all employees via schedule dialogue
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({}); // Adjust based on your data model
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Getting all applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find({}); // Adjust based on your data model
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Retriving applicant details
exports.getApplicantDetails = async (req, res) => {
  try {
    const { applicantId } = req.params;
    const applicant = await Applicant.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ error: "Applicant not found" });
    }
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//retrieving employee details
exports.getEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get first aid expiry 
exports.getFirstAidExpiration = async (req, res) => {
  try {
    const expirations = await Applicant.find(
      { firstAidExpiration: { $exists: true, $ne: null } },
      { firstAidExpiration: 1, email: 1, _id: 0 }
    );

    if (expirations.length === 0) {
      return res
        .status(404)
        .json({
          message: "No applicants with First Aid Expiration dates found",
        });
    }

    res.json(expirations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update applicant status
exports.updateApplicantAttribute = async (req, res) => {
  const applicantId = req.params.applicantId;
  const { attribute, updatedStatus } = req.body;

  console.log(req.body);

  // Dynamically construct the update object based on attribute name
  const update = {};
  update[attribute] = updatedStatus;
  console.log("Update Object:", update);

  try {
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      update,
      { new: true }
    );
    console.log("SUCCESS");

    if (!updatedApplicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    res.json(updatedApplicant);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Controller not working");
  }
};

//updating police expiry 
exports.updatePoliceExpiry = async (req, res, next) => {
  const { employeeId } = req.params;
  const { policeExpiryDate } = req.body;

  try {
    await User.updateOne(
      { _id: employeeId },
      { policeExpiryDate: policeExpiryDate }
    );

    res
      .status(200)
      .json({ message: "Successfully updated police expiry date" });
  } catch (error) {
    console.error("Error updating police expiry date:", error);
    next(new ErrorResponse("Error updating police expiry date", 500));
  }
};

//uploading pdf 
exports.uploadPdf = (req, res, next) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      return next(new ErrorResponse(err.message, 500));
    }

    if (!req.file) {
      return next(new ErrorResponse("No file uploaded", 400));
    }

    const filepath = req.file.path;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return next(new ErrorResponse("User not found", 404));
      }

      user.pdfPath = filepath;
      await user.save();

      res.status(200).json({
        success: true,
        message: "File uploaded and saved to user profile",
      });
    } catch (error) {
      console.error(error);
      next(new ErrorResponse("Error processing file upload", 500));
    }
  });
};
