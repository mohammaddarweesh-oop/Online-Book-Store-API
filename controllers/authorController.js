const {
  Author,
  validateCreateNewAuthor,
  validateUpdateAuthor,
} = require("../models/Authors");
const asyncHandler = require("express-async-handler");

/**
 * @desc Get All Authors
 * @route /api/authors
 * @method Get
 * @access public
 *
 */

const getAllAuthors = asyncHandler(async (req, res) => {
  //pagination
  const { pageNumber } = req.query;
  const authorPerPage = 2;

  const authorsList = await Author.find()
    .sort({ name: 1 })
    .skip((pageNumber - 1) * authorPerPage)
    .limit(authorPerPage);

  res.status(200).json(authorsList);
});

/**
 * @desc Get Author by id
 * @route /api/authors/:id
 * @method Get
 * @access public
 *
 */

const getAuthorById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.status(200).json(author);
  } else {
    res.status(404).json({ message: "Author Not Found" });
  }
});

/**
 * @desc Create new Author
 * @route /api/authors/
 * @method post
 * @access private (only admin)
 *
 */

const createNewAuthor = async (req, res) => {
  const { error } = validateCreateNewAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const author = new Author({
      name: req.body.name,
      image: req.body.image,
    });
    // save in database
    const result = await author.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Something Went wrong" });
  }
};

/**
 * @desc Edit Author
 * @route /api/authors/:id
 * @method put
 * @access private (only admin)
 *
 */

const updateAuthorById = async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        image: req.body.image,
      },
    },
    { new: true }
  );

  res.status(200).json(author);
};

/**
 * @description Delete Author
 * @route /api/authors/:id
 * @method Delete
 * @access private (only admin)
 */

const deleteAuthorById = async (req, res) => {
  // const author = authors.find((aut) => aut.id === parseInt(req.params.id));

  try {
    const author = await Author.findById(req.params.id);

    if (author) {
      await Author.findByIdAndDelete(author);
      res.status(200).json({ message: "Author Deleted" });
    } else {
      res.status(404).json({ message: "Author Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something want wrong" });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createNewAuthor,
  updateAuthorById,
  deleteAuthorById,
};
