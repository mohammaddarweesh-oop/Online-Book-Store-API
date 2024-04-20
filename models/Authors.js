// const { string, required } = require("joi");
const mongoose = require("mongoose");
const joi = require("joi");

const AuthorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      trim: true,
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const Author = mongoose.model("Author", AuthorSchema);

function validateCreateNewAuthor(obj) {
  const schema = joi.object({
    name: joi.string().trim().min(1).max(200).required(),
    image: joi.string().trim().min(1).max(200).required(),
  });
  return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
  schema = joi.object({
    name: joi.string().min(1).max(200).trim(),
    image: joi.string().min(1).max(200).trim(),
  });
  return schema.validate(obj);
}

module.exports = {
  Author,
  validateCreateNewAuthor,
  validateUpdateAuthor,
};
