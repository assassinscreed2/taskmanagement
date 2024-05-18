const express = require("express");
const multer = require("multer");
const { registerUser } = require("../controllers/user.controller");

const upload = multer();

const UserRouter = express.Router();

UserRouter.post("/register", upload.single("profileImage"), registerUser);

module.exports = {
  UserRouter,
};
