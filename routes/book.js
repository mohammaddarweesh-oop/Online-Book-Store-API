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

router.get("/", getAllBooks);

router.get("/:id", getBookById);

router.post("/", verifyTokenAndAdmin, createNewBook);

router.put("/:id", verifyTokenAndAdmin, updateBook);

router.delete("/:id", verifyTokenAndAdmin, deleteBookById);

// validate add new book

module.exports = router;
