const express = require("express");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createNewBook,
  updateBook,
  deleteBookById,
} = require("../controllers/bookController");

// /api/books
router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createNewBook);

// /api/books/:id
router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBookById);

// validate add new book

module.exports = router;
