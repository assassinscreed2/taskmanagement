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
const profileModel = model("Profile", profileSchema);

// Task Schema
const taskSchema = Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  priority: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

// Task Model
const taskModel = model("Task", taskSchema);

module.exports = {
  profileModel,
  taskModel,
};
