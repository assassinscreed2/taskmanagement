const { hashSync, compareSync } = require("bcrypt");
const { uploadImage } = require("../utils/imagekit");
const { model } = require("mongoose");
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

module.exports = {
  registerUser,
};
