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

module.exports = {
  createTask,
};
