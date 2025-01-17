const path = require("path");
const express = require("express");
const { check, body, validationResult } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post(
  "/login",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email.")
      .normalizeEmail(),
    //   .custom((value, { req }) => {
    //     return User.findOne({ email: value }).then((userDoc) => {
    //       if (!userDoc) {
    //         return Promise.reject("E-Mail does not exist.");
    //       }
    //     });
    //   }),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin
);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a Valid Email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          } else {
            return true;
          }
        });
      })
      .normalizeEmail(),

    body(
      "password",
      "Please Enter a Password with only Numbers and Text and at least 5 Characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
