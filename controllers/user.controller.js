const mongoose = require("mongoose");
const User = require("../models/user.model");
const Follower = require("../models/follower.model");

// get all user controller
async function getAllUser(req, res) {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ success: false, error: "No users found" });
    }
    res.status(200).json({ success: true, result: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ success: true, result: user });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "User is successfully created",
      error: err.message,
    });
  }
}

function updateOnUsersNotAllowed(req, res) {
  res.send(`Cannot perform update operation on user at ${req.url}`);
}

function deleteOnUserNotallowed(req, res) {
  res.send(`Cannot perform delete operation on user at ${req.url}`);
}

// get user
async function getSingleUser(req, res) {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(404)
      .json({ success: false, error: `No such user with given id ${userId}` });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given id ${userId}`,
    });
  }
  res.status(200).json({ success: true, result: user });
}

// delete user
async function deleteSingleUser(req, res) {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(404)
      .json({ success: false, error: `No such user with given id ${userId}` });
  }

  const user = await User.findOneAndDelete(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given id ${userId}`,
    });
  }

  res.status(200).json({
    success: true,
    message: "User is successfully deleted",
    result: user,
  });
}

// get followers of user
async function getFollowers(req, res) {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(404)
      .json({ success: false, error: `No such user with given id ${userId}` });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given id ${userId}`,
    });
  }

  res.status(200).json({
    success: true,
    result: user.followers,
  });
}

// get all following
async function getFollowing(req, res) {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(404)
      .json({ success: false, error: `No such user with given id ${userId}` });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given id ${userId}`,
    });
  }

  res.status(200).json({
    success: true,
    result: user.following,
  });
}

// follow user

// function followUser(req, res) {
//   const userId = req.params.userId;

//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res
//       .status(404)
//       .json({ success: false, error: `No such user with given id ${userId}` });
//   }

//   let user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       error: `Cannot find the user with given id ${userId}`,
//     });
//   }

//   const follower = user.followers.push(req.body);

//   user.save();

//   res.status(200).json({
//     success: true,
//     message: "Successfully follow a user",
//     resutl: user,
//   });
// }

async function followUser(req, res) {
  const currentUserId = req.user._id;
  const { username } = req.params;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.status(500).json({ message: "Error finding user" });
    } else if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      user.followers.push(currentUserId);
      user.save((err) => {
        if (err) {
          res.status(500).json({ message: "Error saving user" });
        } else {
          Follower.create(
            { follower: currentUserId, following: user._id },
            (err, follower) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Error creating follower relationship" });
              } else {
                res.status(200).json({ message: "Successfully followed user" });
              }
            }
          );
        }
      });
    }
  });
}

module.exports = {
  getAllUser,
  createUser,
  updateOnUsersNotAllowed,
  deleteOnUserNotallowed,
  getSingleUser,
  deleteSingleUser,
  getFollowers,
  getFollowing,
  followUser,
};
