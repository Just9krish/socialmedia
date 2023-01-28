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
  const { username } = req.params;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given username ${username}`,
    });
  }

  res.status(200).json({
    success: true,
    result: user.followers,
  });
}

// get all following
async function getFollowing(req, res) {
  const { username } = req.params;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given username ${username}`,
    });
  }

  res.status(200).json({
    success: true,
    result: user.following,
  });
}

async function followUser(req, res) {
  const currentUserId = req.user._id;
  const { username } = req.params;

  let user = await User.findOne({ username: username });

  if (!user) {
    return res.status(500).json({ success: false, message: "User not found" });
  }

  user.followers.push(currentUserId);

  user = await user.save();

  if (!user) {
    res.status(500).json({ success: false, message: "Error saving user" });
  }

  const follower = await Follower.create({
    follower: currentUserId,
    following: user._id,
  });

  if (!follower) {
    res.status(500).json({
      success: false,
      message: "Error creating follower relationship",
    });
  }

  res.status(200).json({
    success: true,
    message: "Successfully followed user",
    result: user,
  });
}

// unfollow user
async function unfollowUser(req, res) {
  try {
    const currentUser = req.user;

    const unfollowUsername = req.params.username;

    let userToUnfollow = await User.findOne({ username: unfollowUsername });

    if (!userToUnfollow) {
      return res.status(404).send({ error: "User not found" });
    }

    currentUser.following.pull(userToUnfollow._id);

    userToUnfollow.followers.pull(currentUser._id);

    userToUnfollow = await currentUser.save();
    userToUnfollow = await userToUnfollow.save();

    return res.status(200).send({
      success: true,
      message: "Successfully unfollowed user",
      result: userToUnfollow,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

module.exports = {
  getAllUser,
  createUser,
  getSingleUser,
  deleteSingleUser,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};
