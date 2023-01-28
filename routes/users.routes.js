const express = require("express");
const router = express.Router();

const {
  getAllUser,
  createUser,
  updateOnUsersNotAllowed,
  deleteOnUserNotallowed,
  getSingleUser,
  deleteSingleUser,
  getFollowers,
  getFollowing,
  followUser,
} = require("../controllers/user.controller");

// get all user route
router.get("/", getAllUser);

// create a user route
router.post("/", createUser);

// update
router.put("/", updateOnUsersNotAllowed);

// delete users
router.delete("/", deleteOnUserNotallowed);

// get a specify user
router.get("/:userId", getSingleUser);

// delete a specify user
router.delete("/:userId", deleteSingleUser);

// get followers of user
router.get("/:userId/followers", getFollowers);

// get followings of user
router.get("/:userId/followings", getFollowing);

// add follower to user
router.post("/:userId/follow", followUser);

module.exports = router;
