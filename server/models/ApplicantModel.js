const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const applicantSchema = new mongoose.Schema({
    // Personal Information
    firstName: String,
    middleName: String,
    lastName: String,

    // Contact Information
    email: String,
    cellphone: String,
    landline: String,

    // Other Details
    age: String,
    driversLicense: String,
    accessToCar: String,
    accessToCarOther: String,
    firstAid: String,
    firstAidExpiration: String,
    criminalConvictions: String,
    criminalConvictionsExplain: String,
    policeCheck: String,
    policeCheckOther: String,
    policeCheckExpiry: String,
    dunedinStay: String,
    dunedinStayOther: String,
    summerPeriod: String,
    summerPeriodOther: String,
    permanentResidence: String,
    dunedinArrivalDate: String,
    startWork: String,
    amountOfWorkOther: String,
    regularShiftsOther: String,

    // Arrays
    amountOfWork: [String],
    regularShifts: [String],


    // Work Status
    currentWorkStatus: String,

    // References
    referees: String,
    refereesOther: String,
    refereeInformation: String,


    // Application Documents
    coverLetter: String,
    curriculumVitae: String,

     //Status
     startWorkStatus: {
        type: String,
        default: "Applicant",
    },
    

    applicationStatus: {
        type: String,
        default: "In progress",
    },

    phoneInterviewStatus: {
        type: String,
        default: "In Progress",
    },

    //double check this is the appropriate field type 
    additionalInformationStatus: {
        type: String,
        default: "Nil",
    },

    additionalInformationStatus: {
        type: String,
        default: "In Progress",
    },

    faceToFaceInterviewStatus: {
        type: String,
        default: "In progress",
    },

    policeCheckStatus: {
        type: String,
        default: "In progress",
    },

    referenceCheckStatus: {
        type: String,
        default: "In progress",
    },

    
    inductionStatus: {
        type: String,
        default: "In progress",
    },

    equipmentStatus: {
        type: String,
        default: "In progress",

    },

    phoneInterviewSchedule: {
        type: String,
        default: "Nil",

    },

    inductionSchedule: {
        type: String,
        default: "Nil",
    }

}, { timestamps: true });

// "applicant" = mongodbCollection
const ApplicantModel = mongoose.model("applicant", applicantSchema);

module.exports = ApplicantModel;
