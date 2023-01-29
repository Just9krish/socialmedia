const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user.model");
const authenticate = require("../authenticate");

router.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.status(500).json({ success: false, error: err.message });
      } else {
        if (req.body.name) {
          user.name = req.body.name;
        }
        user.save((err, user) => {
          if (err) {
            res.status(500).json({ error: err.message });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.status(200).json({
                success: true,
                message: "Register successfully!",
              });
            });
          }
        });
      }
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.status(200).json({
      success: true,
      token: token,
      message: "You are successfully login",
    });
  }
);

module.exports = router;
