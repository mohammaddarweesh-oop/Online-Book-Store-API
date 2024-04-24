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

router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createNewBook);

router
  .route("/:id")
  .get(getBookById)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBookById);

// validate add new book

module.exports = router;
