const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("error");
  }
};

module.exports = {
  connectToDB,
};
