const express = require("express");
const multer = require("multer");
const {
  registerUser,
  loginUser,
  validateUser,
} = require("../controllers/user.controller");
const { authenticate_request } = require("../utils/authenticate");

const upload = multer();

const UserRouter = express.Router();

UserRouter.post("/register", upload.single("profileImage"), registerUser);
UserRouter.get("/login", loginUser);
UserRouter.get("/validate", authenticate_request, validateUser);

module.exports = {
  UserRouter,
};
