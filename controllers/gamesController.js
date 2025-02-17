const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");
const { validationResult } = require("express-validator");

const getGames = asyncHandler(async (req, res) => {
  await query.checkGameImages();

  if (Object.keys(req.query).length != 0 && Object.keys(req.query) == 'platform') {
    let games = await query.getGamesByPlatform(req.query.platform);
    res.render('library', { title: "mingleeDB Platform", heading: req.query.platform, selector: 'platform', games: games });
  } else if (Object.keys(req.query).length != 0 && Object.keys(req.query) == 'genre') {
    let games = await query.getGamesByGenre(req.query.genre);
    res.render('library', { title: "mingleeDB Genre", heading: req.query.genre, selector: 'genre', games: games });
  } else {
    let games = await query.getAllGames();
    res.render('library', { title: "mingleeDB Library", heading: "All", selector: "", games: games });
  }
});

const getGameInfo = asyncHandler(async (req,res) => {
  const [game] = await query.getGameById(req.params.gameId);
  res.render("game", {
    title: game.title,
    gameTitle: game.title,
    gameId: game.game_id,
    platform: game.platforms,
    genre: game.genre,
    img_url: game.img_url,
  });
});

const getNewGameForm = asyncHandler(async (req, res) => {
  res.render("newGame", {
    title: "New Game",
    errors: null
  });
})

const submitNewGame = asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if(result.isEmpty()) {
    let platformArr;
    if (req.body.gamePlatform == "") {
      platformArr = ["Other"];
    } else {
      platformArr = req.body.gamePlatform
        .split(',')
        .map(platform => platform.trim())
        .sort((a, b) => a.localeCompare(b));
    }

    let gameURL = req.body.gameImg != "" ? req.body.gameImg : "../public/game.png";
    let genre = req.body.gameGenre != "" ? req.body.gameGenre : "Other";

    query.addGame(req.body.gameName, platformArr, genre, gameURL);
    res.redirect("/");
  } else {
    res.render('newGame', { title: "New Game", errors: result.array() });
  }
});

const getUpdateGameForm = asyncHandler(async(req, res) => {
  const [game] = await query.getGameById(req.query.id);
  res.render("updateGame", {
    title: `Update ${game.title}`,
    id: game.game_id,
    name: game.title,
    platform: game.platforms,
    genre: game.genre,
    image: game.image,
    errors: null,
  });
});

const submitUpdateGame = asyncHandler(async(req, res) => {
  const [game] = await query.getGameById(req.params.id);
  const result = validationResult(req);
  let platformArr;
  if (req.body.gamePlatform == "") {
    platformArr = ["Other"];
  } else {
    platformArr = req.body.gamePlatform
      .split(',')
      .map(platform => platform.trim())
      .sort((a, b) => a.localeCompare(b));
  }

  if (result.isEmpty()) {
    let gameURL = req.body.gameImg != "" ? req.body.gameImg: "../public/game.png";
    query.updateGame(req.params.id, req.body.gameName, platformArr, req.body.gameGenre, gameURL);
    res.redirect("/");
  } else {
    res.render("updateGame", {
      title: `Update ${game.title}`,
      id: game.game_id,
      name: game.title,
      platform: game.platforms,
      genre: game.genre,
      image: game.image,
      errors: result.array()
    });
  }
});

const deletePlatform = asyncHandler(async(req, res) => {
  res.render('delete', {
    title: `Delete ${req.query.platform}?`,
    confirm: `/library/delete/platform?platform=${encodeURIComponent(req.query.platform)}`,
    pass: "",
    deleteItem: req.query.platform,
    selector: "platform",
  });
});

const platformDeleteVerifier = asyncHandler(async(req, res) => {
  const decodedPlatform = decodeURIComponent(req.query.platform);

  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deletePlatform(decodedPlatform);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: `Delete ${decodedPlatform}?`,
      confirm: `/library/delete/platform?platform=${req.query.platform}`,
      pass: "Incorrect value. Nothing was deleted.",
      deleteItem: decodedPlatform,
      selector: "platform",
    });
  }
})

const deleteGenre = asyncHandler(async(req, res) => {
  res.render('delete', {
    title: `Delete ${req.query.genre}?`,
    confirm: `/library/delete/genre?genre=${encodeURIComponent(req.query.genre)}`,
    pass: "",
    deleteItem: req.query.genre,
    selector: "genre",
  });
});

const genreDeleteVerifier = asyncHandler(async(req, res) => {
  const decodedGenre = decodeURIComponent(req.query.genre);

  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deleteGenre(req.query.genre);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: `Delete ${decodedGenre}?`,
      confirm: `/library/delete/genre?genre=${req.query.genre}`,
      pass: "Invalid Password.",
      deleteItem: decodedGenre,
      selector: "genre",
    });
  }
})

const deleteGame = asyncHandler(async(req, res) => {
  const [game] = await query.getGameById(req.query.id);
  res.render('delete', {
    title: `Delete ${game.title}?`,
    confirm: `/game/delete/id?id=${req.query.id}`,
    pass: "",
    deleteItem: game.title,
    selector: "game",
  });
});

const gameDeleteVerifier = asyncHandler(async(req, res) => {
  const [game] = await query.getGameById(req.query.id);
  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deleteGameById(req.query.id);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: `Delete ${req.query.title}}?`,
      confirm: `/game/delete/id?id=${req.query.id}`,
      pass: "Invalid Password.",
      deleteItem: game.title,
      selector: "game",
    });
  }
})

module.exports = {
  getGames,
  getGameInfo,
  getNewGameForm,
  submitNewGame,
  getUpdateGameForm,
  submitUpdateGame,
  deletePlatform,
  platformDeleteVerifier,
  deleteGenre,
  genreDeleteVerifier,
  deleteGame,
  gameDeleteVerifier,
};