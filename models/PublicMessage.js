const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema

const PublicMessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

mongoose.model("publicMessage", PublicMessageSchema);
