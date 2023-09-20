//getting mongoose
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const saltRounds = 10;


const UserSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'applicant', // Refers to the 'applicant' collection
  },

  firstName: {
    type: String,
    trim: true,
    required: [true, 'enter your first name'],
  },

  lastName: {
    type: String,
    trim: true,
    required: [true, 'enter your last name'],
  },

  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'enter a valid email address'],
    match: [
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      'enter in a valid email address'
    ]
  },

  password: {
    type: String,
    required: [true, 'enter a password'],
    minlength: [6, 'Password must contain at least six(6) letters'],
    maxlength: [30, 'Password must not be longer than thirty(30) characters'],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,30}$/,
      'Password must be between 6 to 30 characters, with at least one numeric digit, one uppercase letter, and one lowercase letter'
    ]
  },


// diffrenciating active users and inactive (deleted) users
role: {
  type: String,  
    enum: ['applicant', 'employee', 'inactive'],  
    default: 'applicant'
},

isAdmin: {
  type: Boolean, 
    default: false
},

policeExpiryDate: {
  type: String, 
  default: 'N/A'
},

//PDF handler 
pdfPath: {
  type: String,
  default: ''
}

}, { timestamps: true });

//Encrypting password before saving to database 
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  this.password = await bcrypt.hash(this.password, saltRounds);
});

//Verifying password
UserSchema.methods.comparePassword = async function (yourPassword) {
  return await bcrypt.compare(yourPassword, this.password);
}


//Get the token
UserSchema.methods.jwtGenerateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 3600
  });
}

//"users" = mongodbCollection
const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
