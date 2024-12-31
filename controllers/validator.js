const { body } = require("express-validator");

const validator = [
  body("gameName").trim()
    .notEmpty().withMessage("Game name must be between 1-100 characters.")
    .bail()
    .isLength({ min: 1, max: 100}).withMessage("Game name must be between 1-100 characters.")
    .bail(),
  body("gamePlatform").trim()
    .notEmpty().withMessage("Platform name(s) must be between 1-20 characters, and separated by commas for multiple platforms.")
    .bail()
    .isLength({ min: 1, max: 20}).withMessage("Platform name(s) must be between 1-20 characters, and separated by commas for multiple platforms.")
    .bail(),
  body("gamePlatform").trim()
    .notEmpty().withMessage("Genre name(s) must be between 1-20 characters, and separated by commas for multiple genres.")
    .bail()
    .isLength({ min: 1, max: 20}).withMessage("Platform name(s) must be between 1-20 characters, and separated by commas for multiple genres.")
    .bail(),
]

const editValidator = [
  body(".password").trim()
    .custom(value => {
      return value == process.env.ADMINPASSWORD
    })
    .withMessage("Incorrect password.")
]

module.exports = {
  validator,
  editValidator
}