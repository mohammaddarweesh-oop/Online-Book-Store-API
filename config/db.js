const mongoose = require("mongoose");
// new

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log("Connection Failed To MongoDb!", error);
  }
}

module.exports = connectToDB;

// old

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((error) => console.log("Connection Failed To MongoDb!", error));
