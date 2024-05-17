require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API working successfully" });
});

app.listen(process.env.PORT, () => {
  console.log("Server started on PORT " + process.env.PORT);
});
