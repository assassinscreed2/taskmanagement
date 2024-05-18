const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  validateUser,
  updateProfilePic,
} = require("../controllers/user.controller");
const { authenticate_request } = require("../utils/authenticate");

const upload = multer();

const UserRouter = express.Router();

// Register a new user
UserRouter.post("/register", upload.single("profileImage"), registerUser);

// Login an existing user
UserRouter.post("/login", loginUser);

// validate a user
UserRouter.get("/validate", authenticate_request, validateUser);

// Update profile picture of a user
UserRouter.patch(
  "/profile-pic",
  authenticate_request,
  upload.single("profileImage"),
  updateProfilePic
);

module.exports = {
  UserRouter,
};
