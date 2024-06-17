const User = require("../models/user.js");

module.exports.getSignup = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.postSignup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    const registerUser = await User.register(newUser, password);
    req.logIn(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listing");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.getLogin = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Welcome Back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.redirect(redirectUrl);
};

module.exports.getLogout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged out!");
    res.redirect("/listing");
  });
};
