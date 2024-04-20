const express = require("express");
const expressAsycHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const router = express.Router();
const {
  Book,
  validateAddNewBook,
  validateEditBook,
} = require("../models/Books");

// documentation for api

/**
 *
 * @desc Get All Books
 * @route /api/books
 * @method Get
 * @access public
 */

router.get(
  "/",
  expressAsycHandler(async (req, res) => {
    const books = await Book.find().populate("author", [
      "_id",
      "name",
      "image",
    ]);
    res.status(200).json(books);
  })
);

/**
 * @description Get book by id
 * @route /api/books/:id
 * @method Get
 * @access public
 */

router.get(
  "/:id",
  expressAsycHandler(async (req, res) => {
    // const book = books.find((b) => b.id === parseInt(req.params.id));
    const book = await Book.findById(req.params.id).populate("author", [
      "_id",
      "name",
      "image",
    ]);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "book not found" });
    }
  })
);

/**
 * @description Add New Book
 * @route /api/books
 * @method Post
 * @access private (only admin)
 */

router.post(
  "/",
  verifyTokenAndAdmin,
  expressAsycHandler(async (req, res) => {
    const { error } = validateAddNewBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const book = new Book({
      price: req.body.price,
      rating: req.body.rating,
      title: req.body.title,
      author: req.body.author,
      reviews: req.body.reviews,
      cover: req.body.cover,
      image: req.body.image,
      printLength: req.body.printLength,
      language: req.body.language,
      PublicationDate: req.body.PublicationDate,
      inStock: req.body.inStock,
    });

    const result = await book.save();
    res.status(201).json(result);
  })
);

/**
 * @description Edit New Book
 * @route /api/books/:id
 * @method Put
 * @access private (only admin)
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  expressAsycHandler(async (req, res) => {
    const { error } = validateEditBook(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          price: req.body.price,
          rating: req.body.rating,
          title: req.body.title,
          author: req.body.author,
          reviews: req.body.reviews,
          cover: req.body.cover,
          image: req.body.image,
          printLength: req.body.printLength,
          language: req.body.language,
          PublicationDate: req.body.PublicationDate,
          inStock: req.body.inStock,
        },
      },
      { new: true }
    ).populate("author", ["_id", "name", "image"]);
    res.status(201).json(updatedBook);
  })
);

/**
 * @description Delete w Book
 * @route /api/books/:id
 * @method Delete
 * @access private (only admin)
 */

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  expressAsycHandler(async (req, res) => {
    // const book = books.find((e) => e.id === parseInt(req.params.id));
    const bookById = await Book.findById(req.params.id).populate("author", [
      "_id",
      "name",
      "image",
    ]);

    if (bookById) {
      await Book.findByIdAndDelete(bookById);
      return res.status(201).json({ message: "Book has been Deleted" });
    } else {
      res.status(404).json({ message: "Book Not Found" });
    }
  })
);

// validate add new book

module.exports = router;
