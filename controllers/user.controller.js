const User = require("../models/user.model");

function getAllUser(req, res) {
  res.send("get all user data");
}

module.exports = {
  getAllUser,
};
