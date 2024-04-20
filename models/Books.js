const mongoose = require("mongoose");
const Joi = require("joi");

const BookSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      trim: true,
    },
    author: {
      // select * from Author where Book.id == Author.id
      // اجيب المؤلف تبع الكتاب من جدول المؤلفينهيك الريليشن شيب بالمونجوز
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
      minlength: 3,
      maxlength: 200,
      trim: true,
    },
    reviews: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 200,
      trim: true,
    },
    printLength: {
      type: Number,
      required: true,
      min: 0,
      max: 10000,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
    language: {
      type: String,
      required: true,
      minlength: 3,
      trim: true,
    },
    PublicationDate: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

function validateAddNewBook(obj) {
  const schema = Joi.object({
    price: Joi.number().min(0).required(),
    rating: Joi.number().min(0).required(),
    title: Joi.string().trim().min(3).max(200).required(),
    author: Joi.string().required(),
    reviews: Joi.number().min(0).required(),
    image: Joi.string().trim().min(1).max(200).required(),
    printLength: Joi.number().min(0).max(10000).required(),
    cover: Joi.string().valid("soft cover", "hard cover").required(),
    language: Joi.string().trim().min(3).required(),
    PublicationDate: Joi.string().required(),
    inStock: Joi.boolean().default(true).required(),
  });
  return schema.validate(obj);
}

function validateEditBook(obj) {
  const schema = Joi.object({
    price: Joi.number().min(0),
    rating: Joi.number().min(0),
    title: Joi.string().trim().min(3).max(200),
    author: Joi.string(),
    reviews: Joi.number().min(0),
    image: Joi.string().trim().min(1).max(200),
    printLength: Joi.number().min(0).max(10000),
    cover: Joi.string().valid("soft cover", "hard cover"),
    language: Joi.string().trim().min(3),
    PublicationDate: Joi.string(),
    inStock: Joi.boolean().default(true),
  });
  return schema.validate(obj);
}

module.exports = {
  Book,
  validateAddNewBook,
  validateEditBook,
};
