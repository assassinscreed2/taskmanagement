const { Schema, model } = require("mongoose");

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

const profileModel = model("Profile", profileSchema);

module.exports = {
  profileModel,
};
