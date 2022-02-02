const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, ensurePatient } = require("../helpers/auth");

//Load Medical Model
require("../models/Medical");
const Medical = mongoose.model("medical");

//Load Patient Model
require("../models/Patient");
const Patient = mongoose.model("patient");

//Load PublicMessage Schema
require("../models/PublicMessage");
const PublicMessage = mongoose.model("publicMessage");

//variables
let patientDetails = {};
let govData = [{}];
let test = [{}];

//Medical Index Page
router.get("/", ensurePatient, (req, res) => {
  // Location based messages business logic

  // let j = 0;
  // for (i = 0; i < govData.length; i++) {
  //   let str = govData[i].message;
  //   if (str.includes(patientDetails.location)) {
  //     test[j] = str;
  //     j++;
  //   }
  // }
  // for (i = 0; i < test.length; i++) {
  //   console.log(test[i]);
  // }

  // var name = "Cold";
  // Medical.find(
  //   {
  //     $and: [
  //       { problem: new RegExp("^" + name + "$", "i") },
  //       { uid: patientName }
  //     ]
  //   },
  //   function(err, results) {
  //     console.log(results);
  //   }
  // );

  ///////////////////////////////////////////////////

  Medical.find({ uid: patientName })
    .sort({ date: "desc" })
    // .select({"patientDetails.pass"})
    .then(medical => {
      PublicMessage.find({})
        .sort({ date: "desc" })
        .then(data => {
          govData = data;
        });
      Patient.findOne({ uid: patientName }).then(patient => {
        patientDetails = patient;
      });

      res.render("medical/index", {
        medical: medical,
        patientDetails: patientDetails,
        govData: govData,
        docDetails: req.user
      });
    });
});

//Add Medical
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("medical/add");
});

//Edit Medical Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Medical.findOne({
    _id: req.params.id
  }).then(medical => {
    res.render("medical/edit", {
      medical: medical
    });
  });
});

//Process Medical Form
router.post("/", ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add a title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (errors.length > 0) {
    res.render("medical/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      medicines: req.body.medicines,
      durationOfCourse: req.body.durationOfCourse,
      note: req.body.note,
      problem: req.body.problem,
      uid: patientName,
      docDetails: req.user,
      patientDetails: patientDetails
    };
    new Medical(newUser).save().then(medical => {
      req.flash("success_msg", "Medical Added");
      res.redirect("/medical");
    });
  }
});

//Edit form process

router.put("/:id", ensureAuthenticated, (req, res) => {
  Medical.findOne({
    _id: req.params.id
  }).then(medical => {
    //new values
    medical.title = req.body.title;
    medical.details = req.body.details;
    medical.medicines = req.body.medicines;
    medical.problem = req.body.problem;
    medical.durationOfCourse = req.body.durationOfCourse;
    medical.note = req.body.note;
    medical.save().then(medical => {
      req.flash("success_msg", "Medical Updated");
      res.redirect("/medical");
    });
  });
});

//Delete Medical

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Medical.deleteOne({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Medical Removed");
    res.redirect("/medical");
  });
});

// router.post("v/:id", ensurePatient, (req, res) => {
//   req.param.id;
// Medical.findOne({
//   _id: req.params.id
// }).then(medical => {
//   console.log(medical);
//   medical.visibility = req.body.visibility;
//   Medical.save().then(medical => {
//     req.flash("success_msg", "Case Archeived");
//     res.redirect("/medical");
//   });
// });

// });

module.exports = router;
