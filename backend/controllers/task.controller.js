const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
require("../db/model");
const Task = model("Task");

async function createTask(req, res) {
  try {
    const { username } = req;
    const { title, description, priority, status, createdAt, dueDate } =
      req.body;

    // Check if all fields are present
    if (!title || !priority || !status || !createdAt || !dueDate) {
      return res.status(400).json({
        error:
          "title, priority, status, createdAt, dueDate are required fields",
      });
    }

    const newTask = new Task({
      username,
      title,
      description,
      priority,
      status,
      createdAt,
      dueDate,
    });

    const addedTask = await newTask.save();
    const internal_id = addedTask._id;

    // create publish_id
    const publish_id = Buffer.from(internal_id).toString("base64");

    return res.status(201).json({
      publish_id: publish_id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Create task request failed",
    });
  }
}

async function updateTask(req, res) {
  try {
    const { publish_id } = req.query;
    const { title, description, priority, status, createdAt, dueDate } =
      req.body;

    // Check if atleast on field is provided
    if (
      !title &&
      !description &&
      !priority &&
      !status &&
      !createdAt &&
      !dueDate
    ) {
      return res.status(400).json({
        error: "At least one field is required",
      });
    }

    const updates = {};
    const allowedFields = [
      "title",
      "description",
      "priority",
      "status",
      "createdAt",
      "dueDate",
    ];

    // filter out fields which are not present
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // get document ID from publish id
    const internal_id = Buffer.from(publish_id, "base64").toString("utf8");

    const updateFields = {
      $set: updates,
    };

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: internal_id },
      updateFields,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    return res.status(200).json({
      username: updatedTask.username,
      title: updatedTask.title,
      description: updatedTask.description,
      priority: updatedTask.priority,
      status: updatedTask.status,
      createdAt: updatedTask.createdAt,
      dueDate: updatedTask.dueDate,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Update task request failed",
    });
  }
}

module.exports = {
  updateTask,
  createTask,
};
