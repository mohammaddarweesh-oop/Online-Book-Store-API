const { Book } = require("./models/Books");
const { Author } = require("./models/Authors");
const { books, authors } = require("./data");
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

const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Imported Authors");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const removeAuthors = async () => {
  try {
    await Author.deleteMany(authors);
    console.log("Removed Authors");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  removeBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
}
