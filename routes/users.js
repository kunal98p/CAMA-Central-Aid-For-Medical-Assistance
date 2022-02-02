const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

const { ensureAuthenticated } = require("../helpers/auth");

//Load User model
require("../models/User");
const User = mongoose.model("users");

//User Login Route

// router.get("/login", (req, res) => {
//   res.render("users/login");
// });

//////////////////////////////////////////
let user = "";
let pass = "";

router.get("/login/:user/:pass", (req, res) => {
  (user = req.params.title), (pass = req.params.details);
  res.redirect("/users/login");
});

router.get("/login", (req, res) => {
  res.render("users/login", {
    user: user,
    pass: pass
  });
});
////////////////////////////////////////

//User Register Route

router.get("/register", (req, res) => {
  res.render("users/register");
});

//Login Form POST

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/patient",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//Register Form POST

router.post("/register", (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({ text: "Password Do not match" });
  }
  if (req.body.password.length < 4) {
    errors.push({ text: "Password must be atleast 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      department: req.body.department,
      hospital: req.body.hospital,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email Already Registered");
        res.redirect("/users/login");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          department: req.body.department,
          hospital: req.body.hospital,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;

            newUser
              .save()
              .then(user => {
                req.flash("success_msg", "You are now Registered");
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//Logout User
router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

//Dashboard User
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard/stats");
});

module.exports = router;
