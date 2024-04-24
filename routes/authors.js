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

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createNewAuthor);

router
  .route("/:id")
  .get(getAuthorById)
  .put(verifyTokenAndAdmin, updateAuthorById)
  .delete(verifyTokenAndAdmin, deleteAuthorById);

module.exports = router;
