const mongoose = require("mongoose");
const User = require("../models/user.model");
const Follower = require("../models/follower.model");

// get all user controller
async function getAllUser(req, res) {
  try {
    const users = await User.find().populate("followers", "followings");
    if (!users) {
      return res.status(404).json({ success: false, error: "No users found" });
    }
    res.status(200).json({ success: true, result: users });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// get user
async function getSingleUser(req, res) {
  const { username } = req.params;

  const user = await User.findOne({ username: username }).populate(
    "followers",
    "followings"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given username ${username}`,
    });
  }
  res.status(200).json({ success: true, result: user });
}

// delete user
async function deleteSingleUser(req, res) {
  const { username } = req.params;

  const user = await User.findOneAndDelete({ username: username });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given id ${username}`,
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

  const user = await User.findOne({ username: username }).populate("followers");

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

  const user = await User.findOne({ username: username }).populate(
    "followings"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `Cannot find the user with given username ${username}`,
    });
  }

  res.status(200).json({
    success: true,
    result: user.followings,
  });
}

// follow a user
async function followUser(req, res) {
  const currentUserId = req.user._id;
  const { username } = req.params;

  try {
    let user = await User.findOne({ username: username });
    let followingUser = await User.findOne({ _id: currentUserId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.followers.push(currentUserId);
    followingUser.followings.push(user._id);

    user = await user.save();
    followingUser = await followingUser.save();

    // const follower = await Follower.create({
    //   follower: currentUserId,
    //   following: user._id,
    // });

    // if (!follower) {
    //   res.status(500).json({
    //     success: false,
    //     message: "Error creating follower relationship",
    //   });
    // }

    res.status(200).json({
      success: true,
      message: "Successfully followed user",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// unfollow user
async function unfollowUser(req, res) {
  const { username } = req.params;
  const currentUserId = req.user._id;

  try {
    let user = await User.findOne({ username: username });
    let unfollowingUser = await User.findOne({ _id: currentUserId });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    unfollowingUser.followings.pull(user._id);
    user.followers.pull(unfollowingUser._id);

    unfollowingUser = await unfollowingUser.save();
    user = await user.save();

    res
      .status(200)
      .json({ success: true, message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
};
