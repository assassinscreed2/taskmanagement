const request = require("supertest");
const { app } = require("../server");

jest.mock("../db/models/task");
const Task = require("../db/models/task");
const { authenticate_request } = require("../utils/authenticate");

jest.mock("../utils/authenticate");

describe("Task Routes", () => {
  beforeEach(() => {
    // Mock authenticate_request to always call next()
    authenticate_request.mockImplementation((req, res, next) => {
      req.username = "user1";
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Tests for createTask
  describe("POST /task/create", () => {
    it("should create a task and return publish_id", async () => {
      const mockTask = {
        _id: "507f1f77bcf86cd799439011",
        username: "user1",
        title: "Task 1",
        description: "Description 1",
        priority: "High",
        status: "Pending",
        createdAt: new Date(),
        dueDate: new Date(),
      };
      Task.prototype.save.mockResolvedValue(mockTask);

      const response = await request(app).post("/task/create").send({
        username: "user1",
        title: "Task 1",
        description: "Description 1",
        priority: "High",
        status: "Pending",
        createdAt: new Date(),
        dueDate: new Date(),
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("publish_id");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/task/create").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error:
          "title, priority, status, createdAt, dueDate are required fields",
      });
    });
  });

  // Tests for updateTask
  describe("PATCH /task/update", () => {
    it("should update a task and return updated task", async () => {
      const mockTask = {
        _id: "507f1f77bcf86cd799439011",
        username: "user1",
        title: "Updated Task",
        description: "Updated Description",
        priority: "High",
        status: "Pending",
        createdAt: new Date(),
        dueDate: new Date(),
      };
      Task.findByIdAndUpdate.mockResolvedValue(mockTask);

      const response = await request(app)
        .patch("/task/update")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        })
        .send({ title: "Updated Task" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        username: "user1",
        title: "Updated Task",
        description: "Updated Description",
        priority: "High",
        status: "Pending",
        createdAt: mockTask.createdAt.toISOString(),
        dueDate: mockTask.dueDate.toISOString(),
      });
    });

    it("should return 400 if no fields are provided for update", async () => {
      const response = await request(app)
        .patch("/task/update")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        })
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "At least one field is required",
      });
    });

    it("should return 404 if task not found", async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const response = await request(app)
        .patch("/task/update")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        })
        .send({ title: "Updated Task" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Task not found" });
    });
  });

  // Tests for getTasks
  describe("GET /task", () => {
    it("should return a list of tasks", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", username: "user1" },
        { id: 2, title: "Task 2", username: "user1" },
      ];
      Task.find.mockResolvedValue(mockTasks);

      const response = await request(app).get("/task").set("username", "user1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ tasks: mockTasks });
    });

    it("should handle database errors", async () => {
      Task.find.mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/task").set("username", "user1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch tasks" });
    });
  });

  // Tests for deleteTask
  describe("DELETE /task/delete", () => {
    it("should delete a task and return a message", async () => {
      Task.findByIdAndDelete.mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
      });

      const response = await request(app)
        .delete("/task/delete")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Task deleted" });
    });

    it("should return 400 if publish_id is not provided", async () => {
      const response = await request(app).delete("/task/delete").query({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "publish_id is required" });
    });

    it("should return 404 if task not found", async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete("/task/delete")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Task not found" });
    });
  });
});
