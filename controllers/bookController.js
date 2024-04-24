const expressAsycHandler = require("express-async-handler");
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

const getAllBooks = expressAsycHandler(async (req, res) => {
  console.log(req.query);
  let books;
  const { minPrice, maxPrice } = req.query;

  if (minPrice && maxPrice) {
    books = await Book.find({
      price: { $gte: minPrice, $lte: maxPrice },
    }).populate("author", ["_id", "name", "image"]);
  }
  // comparizon query operator
  // $eq = (equal)
  // $ne (not equal)
  // $lt (less than)
  // $lte (less than and equal)
  // $gt (gtater than)
  // $gte (gtater than and equal)
  books = await Book.find().populate("author", ["_id", "name", "image"]);
  res.status(200).json(books);
});

/**
 * @description Get book by id
 * @route /api/books/:id
 * @method Get
 * @access public
 */

const getBookById = expressAsycHandler(async (req, res) => {
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
});

/**
 * @description Add New Book
 * @route /api/books
 * @method Post
 * @access private (only admin)
 */

const createNewBook = expressAsycHandler(async (req, res) => {
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
});

/**
 * @description Edit New Book
 * @route /api/books/:id
 * @method Put
 * @access private (only admin)
 */

const updateBook = expressAsycHandler(async (req, res) => {
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
});

/**
 * @description Delete w Book
 * @route /api/books/:id
 * @method Delete
 * @access private (only admin)
 */

const deleteBookById = expressAsycHandler(async (req, res) => {
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
});

module.exports = {
  getAllBooks,
  getBookById,
  createNewBook,
  updateBook,
  deleteBookById,
};
