const express = require("express");
const multer = require("multer");
const { registerUser, loginUser } = require("../controllers/user.controller");

const upload = multer();

const UserRouter = express.Router();

UserRouter.post("/register", upload.single("profileImage"), registerUser);
UserRouter.get("/login", loginUser);

module.exports = {
  UserRouter,
};
