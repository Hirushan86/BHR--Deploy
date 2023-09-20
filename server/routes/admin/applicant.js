const express = require("express");
const router = express.Router();
const multer = require("multer");


//const { signUp, signIn, signOut, getUser } = require("../../controllers/user/user");
const { addApplicant, uploadFile } = require("../../controllers/admin/applicant/add");
const ApplicantModel = require("../../models/ApplicantModel"); //Import user model

var storage = multer.diskStorage(
    {
        destination: './uploads',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        }
    }
)
const upload = multer({ storage: storage });

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    res.json({ message: "Successfully uploaded files" });
}

router.post("/add-applicant", addApplicant);
router.post("/upload_files", upload.array("files"), uploadFiles);

module.exports = router;
