const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const UserModel = require("./models/UserModel");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

//IMPORTING ROUTES
const userRoutes = require("./routes/user/user"); //IMPORTING USER ROUTES
const applicantRoutes = require("./routes/admin/applicant");
const pdfRoutes = require("./routes/uploads/pdfUploads");

//Deployment Origins
const allowedOrigins = ['https://bhr-admin-panel.onrender.com', 'http://localhost:8081/']; 
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
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE",
  allowedHeaders: "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
  credentials: true, // Allow credentials (cookies, authorization headers)
  maxAge: 7200, // Max age for requests (2 hours)
};

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// ROUTES MIDDLEWARE
app.use("/api", userRoutes);
app.use("/api", applicantRoutes);
//app.use("/api", pdfRoutes);

//ERROR HANDLING
app.use(errorHandler);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//Route
app.get("/", (req, res) => {
  res.status(201).json({ message: "Connected to server"});
});
