const express = require("express");
const {
  getForgotPasswordView,
  sendForgotPasswordView,
  getResetPasswordView,
  sendResetPasswordView,
} = require("../controllers/passwordController");
const router = express.Router();

router
  .route("/forgot-password")
  .get(getForgotPasswordView)
  .post(sendForgotPasswordView);

router
  .route("/reset-password/:userId/:token")
  .get(getResetPasswordView)
  .post(sendResetPasswordView);

module.exports = router;
