const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { ensureGov } = require("../helpers/auth");

//Load Gov Public message model
require("../models/PublicMessage");
const GovMessage = mongoose.model("publicMessage");

router.get("/", (req, res) => {
  if (req.cookies.isGov === "1") {
    res.redirect("/gov/dashboard");
  } else {
    res.render("gov/login");
  }
});

router.post("/", (req, res) => {
  if (req.body.email === "rmc@gov.in" && req.body.password === "1") {
    res.cookie("isGov", "1");

    res.redirect("/gov/dashboard");
  } else {
    req.flash("error_msg", "Not Valid");
    res.redirect("/gov");
  }
});

router.get("/dashboard", ensureGov, (req, res) => {
  res.render("gov/dashboard");
});

router.get("/stats", ensureGov, (req, res) => {
  res.render("dashboard/stats");
});
let govData = [{}];

router.get("/message", ensureGov, (req, res) => {
  GovMessage.find({})
    .sort({ date: "desc" })
    .then(data => {
      govData = data;
      res.render("gov/publicMessage", { govData: govData });
    });
});

router.post("/message", ensureGov, (req, res) => {
  const { type, message, location } = req.body;

  const data = new GovMessage({
    type,
    message,
    location
  })
    .save()
    .then(publicMessage => {
      req.flash("success_msg", "Message Sent");
      res.redirect("/gov/dashboard");
    })
    .catch(err => {
      console.log(err);
      return;
    });
});

router.get("/logout", ensureGov, (req, res) => {
  res.cookie("isGov", "0");

  res.redirect("/gov");
});

module.exports = router;
