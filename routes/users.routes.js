const express = require("express");
const router = express.Router();

const { getAllUser } = require("../controllers/user.controller");

// get all user
router.get("/", getAllUser);
