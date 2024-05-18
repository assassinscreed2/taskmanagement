const { hashSync, compareSync } = require("bcrypt");
const { uploadImage } = require("../utils/imagekit");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
require("../db/model");
const Profile = model("Profile");

async function checkProfile(username) {
  try {
    const profile = await Profile.find({ username: username });
    return profile;
  } catch (error) {
    throw new Error("Error querying the database");
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.query;

    if (!username || !password) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const profile = await checkProfile(username);

    // check if profile is registered
    if (profile.length == 0) {
      return res.status(401).json({
        error: "Unauthenticated login",
      });
    }

    // check if the password is valid
    if (!compareSync(password, profile[0].password)) {
      return res.status(401).json({ error: "Incorrect Password" });
    }

    const payload = {
      username: profile[0].username,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY);

    res.cookie("token", token);
    return res.status(200).json({
      username: profile[0].username,
      firstname: profile[0].firstname,
      avatar_url: profile[0].avatar_url,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error logging in",
    });
  }
}

async function registerUser(req, res) {
  try {
    const { username, password, firstname } = req.body;

    // validate required inputs
    if (!username || !password || !firstname) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const image = req.file && req.file.buffer.toString("base64");

    const avatar_url = await uploadImage(image, username);

    const existingProfile = await checkProfile(username);

    if (existingProfile.length > 0) {
      return res.status(409).json({
        message: "Profile already present",
        existingProfile,
      });
    }

    // create hashed password
    const hashedPassword = hashSync(password, 10);

    const newProfile = new Profile({
      username,
      password: hashedPassword,
      firstname,
      avatar_url,
    });

    // create a new Profile
    addedProfile = await newProfile.save();
    const internal_id = addedProfile._id;
    const publish_id = Buffer.from(internal_id).toString("base64");

    return res.status(201).json({
      firstname: addedProfile.firstname,
      publish_id: publish_id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Registration failed",
    });
  }
}

async function validateUser(req, res) {
  res.status(200).json({
    valid: true,
  });
}

module.exports = {
  registerUser,
  loginUser,
  validateUser,
};
