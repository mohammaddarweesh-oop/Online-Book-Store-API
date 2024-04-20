const express = require("express");
const router = express.Router();
const expressAsycHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

const {
  Author,
  validateCreateNewAuthor,
  validateUpdateAuthor,
} = require("../models/Authors");

// const authors = [
//   {
//     id: 1,
//     name: "Nizar Qabbani",
//     image: "/authors/nizar.jpg",
//   },
//   {
//     id: 2,
//     name: "Mahmoud Darwish",
//     image: "/authors/darwish.jpg",
//   },
//   {
//     id: 3,
//     name: "Tony Robbins",
//     image: "/authors/tony.jpg",
//   },
//   {
//     id: 4,
//     name: "Elif Shafak",
//     image: "/authors/shafak.jpg",
//   },
//   {
//     id: 5,
//     name: "Brian Tracy",
//     image: "/authors/brain.jpg",
//   },
//   {
//     id: 6,
//     name: "Nassim Nicholas Taleb",
//     image: "/authors/nassim.jpg",
//   },
//   {
//     id: 7,
//     name: "Khalil Gibran",
//     image: "/authors/khalil.jpg",
//   },
//   {
//     id: 8,
//     name: "Debbie Ford",
//     image: "/authors/ford.jpg",
//   },
//   {
//     id: 9,
//     name: "Paulo Coelho",
//     image: "/authors/paulo.jpg",
//   },
//   {
//     id: 10,
//     name: "Wayne Dyer",
//     image: "/authors/wayne.jpg",
//   },
//   {
//     id: 11,
//     name: "Albert Camus",
//     image: "/authors/albert.jpg",
//   },
//   {
//     id: 12,
//     name: "George Orwell",
//     image: "/authors/george.jpg",
//   },
//   {
//     id: 13,
//     name: "Robert Kiyosaki",
//     image: "/authors/kiyosaki.jpg",
//   },
//   {
//     id: 14,
//     name: "Warren Buffett",
//     image: "/authors/buffett.jpg",
//   },
//   {
//     id: 15,
//     name: "Ernest Hemingway",
//     image: "/authors/eh.jpg",
//   },
//   {
//     id: 16,
//     name: "Mark Twain",
//     image: "/authors/mark.jpg",
//   },
//   {
//     id: 17,
//     name: "Xavier Crement",
//     image: "/authors/crement.jpg",
//   },
//   {
//     id: 18,
//     name: "Rolf Dobelli",
//     image: "/authors/rolf.jpg",
//   },
//   {
//     id: 19,
//     name: "George Samuel Clason",
//     image: "/authors/clason.jpg",
//   },
//   {
//     id: 20,
//     name: "Phil Knight",
//     image: "/authors/phil.jpg",
//   },
//   {
//     id: 21,
//     name: "Oscar Wilde",
//     image: "/authors/oscar.jpg",
//   },
//   {
//     id: 22,
//     name: "James Clear",
//     image: "/authors/james.jpg",
//   },
//   {
//     id: 23,
//     name: "Colleen Hoover",
//     image: "/authors/hoover.jpg",
//   },
//   {
//     id: 24,
//     name: "Sajni Patel",
//     image: "/authors/patel.jpg",
//   },
//   {
//     id: 25,
//     name: "Taylor Jenkins Reid",
//     image: "/authors/reid.jpg",
//   },
//   {
//     id: 26,
//     name: "Napolen Hill",
//     image: "/authors/hill.jpg",
//   },
//   {
//     id: 27,
//     name: "Chris Voss",
//     image: "/authors/voss.jpg",
//   },
//   {
//     id: 28,
//     name: "Vex King",
//     image: "/authors/king.jpg",
//   },
//   {
//     id: 29,
//     name: "Juliette Aristides",
//     image: "/authors/j.jpg",
//   },
//   {
//     id: 30,
//     name: "Leo Tolstoy",
//     image: "/authors/leo.jpg",
//   },
// ];
//.sort((a, b) => (a.name > b.name ? 1 : -1));

/**
 * @desc Get All Authors
 * @route /api/authors
 * @method Get
 * @access public
 *
 */

router.get(
  "/",
  expressAsycHandler(async (req, res) => {
    const authorsList = await Author.find().sort({ name: 1 }); //.select("name Image -_id");

    res.status(200).json(authorsList);
  })
);

/**
 * @desc Get Author by id
 * @route /api/authors/:id
 * @method Get
 * @access public
 *
 */

router.get(
  "/:id",
  expressAsycHandler(async (req, res) => {
    // const author = authors.find((aut) => aut.id === parseInt(req.params.id));
    const author = await Author.findById(req.params.id);
    if (author) {
      res.status(200).json(author);
    } else {
      res.status(404).json({ message: "Author Not Found" });
    }
  })
);

/**
 * @desc Create new Author
 * @route /api/authors/
 * @method post
 * @access private (only admin)
 *
 */

router.post("/", verifyTokenAndAdmin, async (req, res) => {
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
});

/**
 * @desc Edit Author
 * @route /api/authors/:id
 * @method put
 * @access private (only admin)
 *
 */

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // const author = authors.find((aut) => aut.id === parseInt(req.params.id));

  // if (author) {
  //   return res.status(201).json({ message: "Book has been updated" });
  // } else {
  //   return res.status(404).json({ message: "Author Not Found" });
  // }
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
});

/**
 * @description Delete Author
 * @route /api/authors/:id
 * @method Delete
 * @access private (only admin)
 */

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
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
});

module.exports = router;
