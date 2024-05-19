require("dotenv").config();
const express = require("express");
const app = express();
const { connectToDB } = require("./db/index");
const { UserRouter } = require("./routes/user.route");
const { TaskRouter } = require("./routes/task.route");

app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

app.get("/", (req, res) => {
  res.json({ message: "API working successfully" });
});

const startServer = async () => {
  try {
    // Establish connection to the database
    await connectToDB();

    // Start the server
    app.listen(process.env.PORT, () => {
      console.log("Server started on PORT " + process.env.PORT);
    });
  } catch (error) {
    console.log("Failed to connect to the database", error);

    // Terminates Nodejs process
    process.exit(1);
  }
};

startServer();
