const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema

const MedicalSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  docDetails: {
    type: Object
  },
  patientDetails: {
    type: Object
  },
  medicines: {
    type: String
  },
  durationOfCourse: {
    type: String
  },
  problem: {
    type: String
  },
  note: {
    type: String
  },
  visibility: {
    type: String,
    default: "1"
  }
});

mongoose.model("medical", MedicalSchema);
