const { Schema, model } = require("mongoose");

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
    type: Number,
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
module.exports = model("Task", taskSchema);
