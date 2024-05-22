const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
require("../db/models/task");
const Task = require("../db/models/task");

async function createTask(req, res) {
  try {
    const { username } = req;
    let { title, description, priority, status, createdAt, dueDate } = req.body;

    // Trim title and description
    title = title.trim();
    description = description.trim();

    // Check if all fields are present
    if (!title || !priority || !status || !createdAt || !dueDate) {
      return res.status(400).json({
        error:
          "title, priority, status, createdAt, dueDate are required fields",
      });
    }

    // Check the length of title and description
    if (title.length > 50) {
      return res.status(400).json({
        error: "Title must be no more than 50 characters",
      });
    }

    if (description.length > 300) {
      return res.status(400).json({
        error: "Description must be no more than 300 characters",
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
    let { title, description, priority, status, createdAt, dueDate } = req.body;

    // Check if at least one field is provided
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

    // Filter out fields which are not present
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Trim title and description if they exist in the updates
    if (updates.title) {
      updates.title = updates.title.trim();
      if (updates.title.length > 50) {
        return res.status(400).json({
          error: "Title must be no more than 50 characters",
        });
      }
    }

    if (updates.description) {
      updates.description = updates.description.trim();
      if (updates.description.length > 300) {
        return res.status(400).json({
          error: "Description must be no more than 300 characters",
        });
      }
    }

    // Get document ID from publish id
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

async function getTasks(req, res) {
  try {
    const { username } = req;

    const tasks = await Task.find({ username: username });

    const updatedTasks = tasks.map((task) => {
      const publish_id = Buffer.from(task._id.toString()).toString("base64");
      return { ...task.toObject(), _id: publish_id };
    });

    return res.status(200).json({ tasks: updatedTasks });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Failed to fetch tasks",
    });
  }
}

async function deleteTask(req, res) {
  try {
    const { publish_id } = req.query;

    if (!publish_id) {
      return res.status(400).json({
        error: "publish_id is required",
      });
    }

    const internal_id = Buffer.from(publish_id, "base64").toString("utf8");
    const deletedTask = await Task.findByIdAndDelete({ _id: internal_id });

    if (!deletedTask) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Failed to delete tasks",
    });
  }
}

module.exports = {
  getTasks,
  deleteTask,
  updateTask,
  createTask,
};
