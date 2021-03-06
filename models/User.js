const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  hospital: {
    type: String
  },
  department: {
    type: String
  }
});

mongoose.model("users", UserSchema);
