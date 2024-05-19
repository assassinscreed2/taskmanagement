const express = require("express");
const multer = require("multer");
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
} = require("../controllers/task.controller");
const { authenticate_request } = require("../utils/authenticate");

const TaskRouter = express.Router();

// Create a new task
TaskRouter.post("/task/create", authenticate_request, createTask);

// Update a task
TaskRouter.patch("/task/update", authenticate_request, updateTask);

// delete a task
TaskRouter.delete("/task/delete", authenticate_request, deleteTask);

// fetch tasks
TaskRouter.get("/task", authenticate_request, getTasks);

module.exports = {
  TaskRouter,
};
