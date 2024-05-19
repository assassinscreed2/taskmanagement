const { Schema, model } = require("mongoose");

// Profile Schema
const profileSchema = Schema({
  firstname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar_url: {
    type: String,
  },
});

// Profile Model
module.exports = model("Profile", profileSchema);
