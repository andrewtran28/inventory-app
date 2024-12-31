const { Router } = require("express");
const indexRouter = Router();

const indexController = require("../controllers/indexController");
const gamesController = require("../controllers/gamesController");
const { validator, editValidator } = require("../controllers/validator.js");

indexRouter.get("/library/new", gamesController.getNewGameForm);
indexRouter.post("/library/new", validator, gamesController.submitNewGame);
// indexRouter.post("/library/delete/platform", gamesController.platformDeleteVerifier);
indexRouter.get("/library/delete/platform", gamesController.deletePlatform);

// indexRouter.post("/library/delete/genre", gamesController.genreDeleteVerifier);
indexRouter.get("/library/delete/genre", gamesController.deleteGenre);

// indexRouter.post("/library/delete/game", gameController.gameDeleteVerifier);
indexRouter.get("/library/delete/game", gamesController.deleteGame);

indexRouter.post("/library/update/:id", validator, editValidator, gamesController.submitUpdateGame);
indexRouter.get("/library/update/:id", gamesController.getUpdateGameForm);

indexRouter.get("/library", gamesController.getGames);
indexRouter.get("/", indexController.getIndex);

module.exports = indexRouter;