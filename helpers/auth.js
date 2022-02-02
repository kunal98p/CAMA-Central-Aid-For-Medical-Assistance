module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  },
  ensurePatient: (req, res, next) => {
    if (req.cookies.isLoggedIn === "1") {
      return next();
    }
    req.flash("error_msg", "Not Authorized");
    res.redirect("/patient/login");
  },
  ensureGov: (req, res, next) => {
    if (req.cookies.isGov === "1") {
      return next();
    }
    req.flash("error_msg", "Gov Route No Acceess");
    res.redirect("/gov");
  }
};
