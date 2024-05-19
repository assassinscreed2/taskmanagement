const http = require("http");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { app } = require("../server");
const { authenticate_request } = require("../utils/authenticate");

jest.mock("../db/models/profile");
const Profile = require("../db/models/profile");

jest.mock("../utils/authenticate");
jest.mock("../utils/imagekit");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../utils/imagekit", () => {
  return {
    uploadImage: jest.fn().mockResolvedValue("http://example.com/avatar.jpg"),
  };
});

describe("User Routes", () => {
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

  describe("POST /register", () => {
    it("should register a user and return publish_id", async () => {
      const mockProfile = {
        _id: "507f1f77bcf86cd799439011",
        username: "user1",
        password: "hashedPassword",
        firstname: "John",
        avatar_url: "http://example.com/avatar.jpg",
      };

      Profile.find.mockResolvedValue([]);
      bcrypt.hashSync.mockReturnValue("hashedPassword");
      Profile.prototype.save.mockResolvedValue(mockProfile);

      const response = await request(app).post("/register").send({
        username: "user1",
        password: "password123",
        firstname: "John",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("publish_id");
      expect(response.body.firstname).toBe("John");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/register").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "All fields are required",
      });
    });

    it("should return 409 if profile already exists", async () => {
      const mockProfile = [{ username: "user1" }];

      Profile.find.mockResolvedValue(mockProfile);

      const response = await request(app).post("/register").send({
        username: "user1",
        password: "password123",
        firstname: "John",
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Profile already present");
    });
  });

  describe("POST /login", () => {
    it("should login a user and return user details", async () => {
      const mockProfile = [
        {
          _id: "507f1f77bcf86cd799439011",
          username: "user1",
          password: "hashedPassword",
          firstname: "John",
          avatar_url: "http://example.com/avatar.jpg",
        },
      ];

      Profile.find.mockResolvedValue(mockProfile);
      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue("token");

      const response = await request(app).post("/login").send({
        username: "user1",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.username).toBe("user1");
      expect(response.body.firstname).toBe("John");
      expect(response.body.avatar_url).toBe("http://example.com/avatar.jpg");
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/login").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Username and password are required",
      });
    });

    it("should return 401 if user is not found", async () => {
      Profile.find.mockResolvedValue([]);

      const response = await request(app).post("/login").send({
        username: "user1",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Unauthenticated login");
    });

    it("should return 401 if password is incorrect", async () => {
      const mockProfile = [
        {
          _id: "507f1f77bcf86cd799439011",
          username: "user1",
          password: "hashedPassword",
          firstname: "John",
          avatar_url: "http://example.com/avatar.jpg",
        },
      ];

      Profile.find.mockResolvedValue(mockProfile);
      bcrypt.compareSync.mockReturnValue(false);

      const response = await request(app).post("/login").send({
        username: "user1",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Incorrect Password");
    });
  });

  describe("PATCH /profile-pic", () => {
    it("should return 400 if username or publish_id is missing", async () => {
      const response = await request(app).patch("/profile-pic").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Username and publish_id are required"
      );
    });

    it("should return 400 if profile image is not provided", async () => {
      const response = await request(app)
        .patch("/profile-pic")
        .query({
          publish_id: Buffer.from("507f1f77bcf86cd799439011").toString(
            "base64"
          ),
        })
        .send({ username: "user1" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Profile image is required");
    });
  });

  describe("GET /profile-pic", () => {
    it("should validate user", async () => {
      const response = await request(app).get("/validate");

      expect(response.status).toBe(200);
      expect(response.body.valid).toBe(true);
    });
  });
});
