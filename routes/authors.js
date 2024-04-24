const express = require("express");
const router = express.Router();

const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAuthorById,
  createNewAuthor,
  updateAuthorById,
  deleteAuthorById,
  getAllAuthors,
} = require("../controllers/authorController");

router.get("/", getAllAuthors);

router.get("/:id", getAuthorById);

router.post("/", verifyTokenAndAdmin, createNewAuthor);

router.put("/:id", verifyTokenAndAdmin, updateAuthorById);

router.delete("/:id", verifyTokenAndAdmin, deleteAuthorById);

module.exports = router;
