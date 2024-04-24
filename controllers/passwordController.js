const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/**
 *
 * @desc Get Forgot Password
 * @route /password/forgot-password
 * @method GET
 * @access public
 */

module.exports.getForgotPasswordView = asyncHandler((req, res) => {
  res.render("forgot-password");
});

/**
 *
 * @desc Send Forgot Password
 * @route /password/forgot-password
 * @method Post
 * @access public
 */

module.exports.sendForgotPasswordView = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  try {
    const secret = process.env.JWT_SECRET_KEY + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, {
      expiresIn: "10m",
    });

    const link = `http://localhost:5000/password/reset-password/${user._id}/${token}`;
    res
      .status(200)
      .json({ message: "Click On The Link", resentPasswordLink: link });
  } catch (error) {
    console.log(error);
    res.json({ message: "Errorrrrrr" });
  }
});

/**
 *
 * @desc Get Reset Password Link
 * @route /reset-password/:userId/:token
 * @method Get
 * @access public
 */

module.exports.getResetPasswordView = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);
    res.render("reset-password", { email: user.email });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
  }
});
/**
 *
 * @desc Reset Password
 * @route /reset-password/:userId/:token
 * @method POST
 * @access public
 */

module.exports.sendResetPasswordView = asyncHandler(async (req, res) => {
  // todo validation

  const user = await User.findById(req.params.userId);

  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }

  console.log(user);

  const secret = process.env.JWT_SECRET_KEY + user.password;

  try {
    jwt.verify(req.params.token, secret);
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user.password = req.body.password;

    await user.save();

    res.render("success-password");
  } catch (error) {
    console.log(error, user);
    res.json({ message: "Error not" });
  }
});
