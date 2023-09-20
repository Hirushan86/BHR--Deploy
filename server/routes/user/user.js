const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  getUser,
  getAllEmployees,
  getAllApplicants,
  getApplicantDetails,
  getEmployeeDetails,
  getFirstAidExpiration,
  updUserInactive,
  updateApplicantAttribute,
  updatePoliceExpiry,
  getUserInfo
} = require("../../controllers/user/user");
const UserModel = require("../../models/UserModel");
const ApplicantModel = require("../../models/ApplicantModel");
const authMiddleware = require("../../middleware/auth");

//Routes
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get(
  "/applicantsDetails/applicant/firstAidExpiration",
  getFirstAidExpiration
);
router.get("/signOut", signOut);
router.get("/info", authMiddleware, getUserInfo); 
router.get("/applicants", authMiddleware, getAllApplicants);
router.get("/employees", authMiddleware,getAllEmployees);
router.get("/applicantsDetails/applicant/:applicantId", authMiddleware, getApplicantDetails);
router.put(
  "/employeesDetails/employee/:employeeId/policeExpiryDate", authMiddleware,
  updatePoliceExpiry
);
router.get("/employeesDetails/employee/:employeeId", authMiddleware, getEmployeeDetails);
router.put("/updateStatus/:applicantId", authMiddleware, updateApplicantAttribute);

// router.put("/setUserInactive/:id", updUserInactive); // Route to set a user to inactive
/* router.put('/setUserInactive/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const updatedUser = await updUserInactive(userId);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User set to inactive", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});
*/
// router.put("/setUserActive/:id", updUserActive); // Route to set a user to active



router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//put method to update the status fields via  - using attribute!!!!

module.exports = router;
