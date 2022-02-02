const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema

const PatientSchema = new Schema({
  uid: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String
  }
});

mongoose.model("patient", PatientSchema);
