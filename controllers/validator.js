const { body } = require("express-validator");

const validator = [
  body("gameName").trim()
    .notEmpty().withMessage("Game title must be between 1-100 characters.")
    .bail()
    .isLength({ min: 1, max: 100}).withMessage("Game name must be between 1-100 characters.")
    .bail(),
  body("gamePlatform").trim()
    .matches(/^[a-zA-Z0-9, ]*$/).withMessage("Platforms must only contain letters or numbers, and separated by commas if there are multiple platforms.")
    .isLength({ max: 100})
    .bail(),
  body("gameGenre").trim()
    .matches(/^[a-zA-Z0-9 ]*$/).withMessage("Genre must only contain letters or numbers.")
    .isLength({ max: 20 }).withMessage("Genre must be a maximum of 20 characters or empty.")
    .bail(),
]

const editValidator = [
  body(".password").trim()
    .custom(value => {
      return value == process.env.ADMIN_PASSWORD
    })
    .withMessage("Type 'delete' to confirm deletion. Note: Case sensitive.")
]

module.exports = {
  validator,
  editValidator
}