const { Book } = require("./models/Books");
const { books } = require("./data");
const connectToDB = require("./config/db");
require("dotenv").config();

//Connection To DB
connectToDB();

// insert books to database
const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Imported Books");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// remove all books from database
const removeBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books removed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
}
