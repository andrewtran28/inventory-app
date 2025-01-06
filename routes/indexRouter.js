const { Router } = require("express");
const indexRouter = Router();

const indexController = require("../controllers/indexController");
const gamesController = require("../controllers/gamesController");
const { validator, editValidator } = require("../controllers/validator.js");

indexRouter.get("/library/new", gamesController.getNewGameForm);
indexRouter.post("/library/new", validator, gamesController.submitNewGame);

indexRouter.post("/library/delete/platform", gamesController.platformDeleteVerifier);
indexRouter.get("/library/delete/platform", gamesController.deletePlatform); 

indexRouter.post("/library/delete/genre", gamesController.genreDeleteVerifier);
indexRouter.get("/library/delete/genre", gamesController.deleteGenre);

// indexRouter.post("/library/delete/game", gamesController.gameDeleteVerifier);
// indexRouter.get("/library/delete/game", gamesController.deleteGame);

indexRouter.post("/game/delete/:id", gamesController.gameDeleteVerifier);
indexRouter.get("/game/delete/:id", gamesController.deleteGame);

// indexRouter.post("/game/:gameId/update", validator, editValidator, gamesController.submitUpdateGame);
// indexRouter.get("/game/:gameId/update", gamesController.getUpdateGameForm);

indexRouter.get("/game/:gameId", gamesController.getGameInfo);
indexRouter.get("/library", gamesController.getGames);
indexRouter.get("/", indexController.getIndex);

module.exports = indexRouter;