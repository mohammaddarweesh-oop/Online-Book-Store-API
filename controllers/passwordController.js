const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// for email validation or send emails ...etc
const nodemailer = require("nodemailer");

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        password: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: user.email,
      subject: "Reset Password",
      html: `<div>
              <h1> Click On The Link Below To Reset Password </h1>
              <p>${link}</p>
            </div>`,
    };

    transporter.sendMail(mailOptions, function (error, success) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
      } else {
        console.log("Email sent :" + success);
        res.render("link-send");
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Error" });
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
  const { error } = validateChangePassword(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].error });
  }

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
