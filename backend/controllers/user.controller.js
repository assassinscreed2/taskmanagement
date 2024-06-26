const { hashSync, compareSync } = require("bcrypt");
const { uploadImage } = require("../utils/imagekit");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
require("../db/models/profile");
const Profile = require("../db/models/profile");

async function checkProfile(username) {
  try {
    const profile = await Profile.find({ username: username });
    return profile;
  } catch (error) {
    throw new Error("Error querying the database");
  }
}

async function fetchProfile(req, res) {
  const { username } = req;

  try {
    const profile = await checkProfile(username);
    const internal_id = profile[0]._id;
    const publish_id = Buffer.from(internal_id.toString()).toString("base64");

    const updatedProfile = {
      username: profile[0].username,
      avatar_url: profile[0].avatar_url,
      firstname: profile[0].firstname,
      publish_id: publish_id,
    };

    delete updateProfilePic["_id"];

    return res.status(200).json({
      profile: updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error logging in",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

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
    const addedProfile = await newProfile.save();
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

async function updateProfilePic(req, res) {
  try {
    const { username } = req;
    const { publish_id } = req.query;

    if (!username || !publish_id) {
      return res.status(400).json({
        message: "Username and publish_id are required",
      });
    }

    const existingProfile = await checkProfile(username);

    if (existingProfile.length === 0) {
      return res.status(401).json({
        message: "User not registered",
      });
    }

    const internal_id = Buffer.from(publish_id, "base64").toString("utf8");

    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const image = req.file && req.file.buffer.toString("base64");
    const avatar_url = await uploadImage(image, username);

    const updateProfile = {
      $set: {
        avatar_url,
      },
    };

    const updatedProfile = await Profile.findByIdAndUpdate(
      { _id: internal_id },
      updateProfile,
      { new: true }
    );

    return res.status(200).json({
      updatedProfile,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Profile Image update failed",
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
  updateProfilePic,
  fetchProfile,
};
