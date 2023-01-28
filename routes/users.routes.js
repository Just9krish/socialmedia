const express = require("express");
const router = express.Router();
const { verfiyUser } = require("../authenticate");

const {
  getAllUser,
  getSingleUser,
  deleteSingleUser,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
} = require("../controllers/user.controller");

// get all user route
router.get("/", verfiyUser, getAllUser);

// get a specify user
router.get("/:username", verfiyUser, getSingleUser);

// delete a specify user
router.delete("/:username", verfiyUser, deleteSingleUser);

// get followers of user
router.get("/:username/followers", verfiyUser, getFollowers);

// get followings of user
router.get("/:username/followings", verfiyUser, getFollowing);

// add follower to user
router.post("/:username/follow", verfiyUser, followUser);

// unfollow user
router.delete("/:username/unfollow", verfiyUser, unfollowUser);

module.exports = router;
