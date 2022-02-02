const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/User");
const User = mongoose.model("users");
const { ensureAuthenticated, ensurePatient } = require("../helpers/auth");

require("../models/Medical");
const Medical = mongoose.model("medical");

require("../models/Patient");
const Patient = mongoose.model("patient");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("patient/landing", {
    name: req.user.name,
    hospital: req.user.hospital,
    department: req.user.department
  });
});

let unid = "";
let pass = "";
let notYou = "";

router.get("/login/:unid&:pass", (req, res) => {
  (unid = req.params.unid), (pass = req.params.pass);
  notYou = "Not you??";
  res.redirect("/patient/login");
});

router.get("/login", (req, res) => {
  res.cookie("isLoggedIn", "0");
  res.render("patient/plogin", {
    unid: unid,
    pass: pass,
    notYou: notYou
  });
  notYou = "";
});

router.post("/login", (req, res) => {
  Patient.findOne({ uid: req.body.uid }).then(patient => {
    patientName = patient.uid;

    res.cookie("isLoggedIn", "1");
    res.redirect("/medical");
  });
});

router.get("/register", (req, res) => {
  res.render("patient/pregister");
});

router.post("/register", ensureAuthenticated, (req, res) => {
  const newPatient = {
    name: req.body.name,
    uid: req.body.uid,
    age: req.body.age,
    weight: req.body.weight,
    height: req.body.height,
    area: req.body.area,
    city: req.body.city,
    bloodGroup: req.body.bloodGroup,
    gender: req.body.gender
  };

  new Patient(newPatient).save().then(patient => {
    req.flash("success_msg", "Patient Added");
    res.redirect("/patient/login");
  });
});

module.exports = router;
