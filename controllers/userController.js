const asycHandler = require("express-async-handler");
const bcript = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

/**
 * @desc Update user
 * @route /api/users/:id
 * @method put
 * @access private
 *
 */

module.exports.updateUser = asycHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  }
  // const userById = await User.findById(req.body.id);

  if (req.body.password) {
    const salt = bcript.genSalt(10);
    req.body.password = await bcript.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password");
  res.status(200).json(user);
});

/**
 * @desc Get all users
 * @route /api/users
 * @method Get
 * @access private (Only Admin)
 *
 */

module.exports.getAllUsers = asycHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 * @desc Get user by id
 * @route /api/users/:id
 * @method Get
 * @access private (Only Admin && user himself)
 *
 */

module.exports.getUserById = asycHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});

/**
 * @desc Delete user by id
 * @route /api/users/:id
 * @method Delete
 * @access private (Only Admin && user himself)
 *
 * protected route
 */

module.exports.deleteUserById = asycHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    res.status(200).json({ message: "User Deleted" });
  } else {
    res.status(404).json({ message: "User Not Found" });
  }
});
