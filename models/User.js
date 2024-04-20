const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
      trim: true,
      uniqe: true,
    },
    username: {
      type: String,
      minlength: 3,
      maxlength: 100,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 100,
      required: true,
      trim: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "90d" }
  );
};

const User = mongoose.model("User", userSchema);

// validate register user

function validateRgisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).max(100).required().email(),
    username: Joi.string().trim().min(3).max(100).required(),
    password: Joi.string().trim().min(8).max(100).required(),
  });
  return schema.validate(obj);
}
// validate login user

function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).max(100).email().required(),
    password: Joi.string().trim().min(8).max(100).required(),
  });
  return schema.validate(obj);
}
// validate update user

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(3).max(100).email(),
    username: Joi.string().trim().min(3).max(100),
    password: Joi.string().trim().min(8).max(100),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRgisterUser,
  validateLoginUser,
  validateUpdateUser,
};
