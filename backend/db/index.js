const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("Error");
    throw new Error("Error connecting to Database");
  }
};

module.exports = {
  connectToDB,
};
