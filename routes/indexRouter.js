const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
// const gamesController = require("../controllers/gamesController");

// const { validator, editValidator } = require("../controllers/validators/validateProduct.js");

// indexRouter.post("/library/new", validator, gamesController.postNewProduct);
indexRouter.get("/", indexController.getIndex);



module.exports = indexRouter;