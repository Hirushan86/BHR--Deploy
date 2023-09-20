const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const UserModel = require("./models/UserModel");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//IMPORTING ROUTES
const userRoutes = require("./routes/user/user"); //IMPORTING USER ROUTES
const applicantRoutes = require("./routes/admin/applicant");
const pdfRoutes = require("./routes/uploads/pdfUploads");


require("dotenv").config();

const app = express();

// DATABASE CONNECTION
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.log("MongoDB connection failed:", err.message));
  
//MIDDLEWARE
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// ROUTES MIDDLEWARE
app.use("/api", userRoutes);
app.use("/api", applicantRoutes);
app.use("/api", pdfRoutes); 

//ERROR HANDLING
app.use(errorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});