const express = require("express");
const expressAsycHandler = require("express-async-handler");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const {
  User,
  validateLoginUser,
  validateRgisterUser,
  validateUpdateUser,
} = require("../models/User");

/**
 * @desc Register new user
 * @route /api/auth/register
 * @method post
 * @access public
 *
 */

router.post(
  "/register",
  expressAsycHandler(async (req, res) => {
    const { error } = validateRgisterUser(req.body);

    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    // search user in data base
    let user = await User.findOne({ email: req.body.email });

    const salt = await bcript.genSalt(10);

    if (user) {
      return res.status(400).json({ message: "This User Already Registered" });
    }

    req.body.password = await bcript.hash(req.body.password, salt);

    user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    const result = await user.save();
    const token = user.generateToken();
    // const token = jwt.sign(
    //   { id: user._id, isAdmin: user.isAdmin },
    //   process.env.JWT_SECRET_KEY,
    //   { expiresIn: "90d" }
    // );
    const { password, ...other } = result._doc;
    res.status(201).json({ ...other, token });
  })
);

/**
 * @desc Login new user
 * @route /api/auth/login
 * @method post
 * @access public
 *
 */

router.post(
  "/login",
  expressAsycHandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
    }

    // ===========================> email must be object
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({ message: "Invalied Email Or Password" });
    }

    const isPasswordMatch = await bcript.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      res.status(404).json({ message: "Invalied Email Or Password" });
    }
    const token = user.generateToken();
    // const token = jwt.sign(
    //   { id: user._id, isAdmin: user.isAdmin },
    //   process.env.JWT_SECRET_KEY,
    //   {
    //     // 3 month or 90 day / 90h == 90 hour / 90m == 90 minute
    //     expiresIn: "90d",
    //   }
    // );
    const { password, ...other } = user._doc;
    res.status(200).json({ ...other, token });
  })
);

module.exports = router;
