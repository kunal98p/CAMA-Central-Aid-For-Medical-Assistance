const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");

const app = express();

//Load routes
const medical = require("./routes/medical");
const users = require("./routes/users");
const patient = require("./routes/patient");
const gov = require("./routes/gov");

//Passport Config
require("./config/passport")(passport);

//done
//DB Config
const db = require("./config/keys");
// Connect to mongoose
mongoose
  .connect(db.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));

//Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
let hbs = require("handlebars");
hbs.registerHelper("ifCond", function(v1, v2, options) {
  if (v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});
hbs.registerHelper("counter", function(index) {
  return index + 1;
});

//Body-parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Express session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
app.use(flash());

//Global variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  next();
});

app.use(cookieParser());

global.patientName = "";
//Method override for PUT request Middleware
app.use(methodOverride("_method"));

//index Route
const PublicMessage = mongoose.model("publicMessage");
let govData = [{}];

app.get("/", (req, res) => {
  //Load Service Worker
  PublicMessage.find({ type: "General Notice" })
    .sort({ date: "desc" })
    .then(data => {
      govData = data;
      res.render("index", {
        govData: govData
      });
    });

  //res.sendFile(__dirname + "/kunal.html");
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/sw.js", function(req, res) {
  //send the correct headers
  res.header("Content-Type", "text/javascript");

  res.sendFile(path.join(__dirname, "sw.js"));
});

app.get("/css", function(req, res) {
  res.sendFile(path.join(__dirname, "public/css/style.css"));
});

//Medical routes
app.use("/medical", medical);

//Users routes
app.use("/users", users);

//Patient routes
app.use("/patient", patient);

//Gov routes
app.use("/gov", gov);

//Load Medical Model
require("./models/Medical");
const Medical = mongoose.model("medical");

app.put("/medical/x/:id", (req, res) => {
  Medical.findOne({
    _id: req.params.id
  })
    .then(medical => {
      medical.visibility = req.body.visibility;
      medical.save().then(medical => {
        req.flash("success_msg", "Your case is Archieved Successfully");
        res.redirect("/medical");
      });
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/medical/y/:id", (req, res) => {
  Medical.findOne({
    _id: req.params.id
  })
    .then(medical => {
      medical.visibility = req.body.visibility;
      medical.save().then(medical => {
        req.flash("success_msg", "Your case is Un-archieved");
        res.redirect("/medical");
      });
    })
    .catch(err => {
      res.json(err);
    });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("server started..");
});
