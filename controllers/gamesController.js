const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");
const { validationResult } = require("express-validator");

const getGames = asyncHandler(async (req, res) => {
  if (Object.keys(req.query).length != 0 && Object.keys(req.query) == 'platform') {
    let games = await query.getGamesByPlatform(req.query.platform);
    res.render('library', { title: "Game Library", heading: req.query.platform, games: games });
  } else if (Object.keys(req.query).length != 0 && Object.keys(req.query) == 'genre') {
    let games = await query.getGamesByGenre(req.query.genre);
    res.render('library', { title: "Game Library", heading: req.query.genre, games: games });
  } else {
    let games = await query.getAllGames();
    res.render('library', { title: "Game Library", heading: "All", games: games });
  }
});

const getNewGameForm = asyncHandler(async (req, res) => {
  res.render("newGame", {
    title: "New Game",
    errors: null
  });
})

const submitNewGame = asyncHandler(async (req, res) => {
  const result = validationResult(req);
  let platformArr;

  if(result.isEmpty()) {

    if (req.body.gamePlatform == "") {
      platformArr = ["Other"];
    } else {
      platformArr = req.body.gamePlatform.split(',').map(platform => platform.trim());
    }

    let gameURL = req.body.gameImg != "" ? req.body.gameImg : "../public/game.png";
    let genre = req.body.gameGenre != "" ? req.body.gameGenre : "Other";

    query.addGame(req.body.gameName, platformArr, genre, gameURL);
    res.redirect('/');
  } else {
    res.render('newGame', { title: "New Game", errors: result.array() });
  }
});

const getUpdateGameForm = asyncHandler(async(req, res) => {
  const game = await query.getGameById(req.params.id);
  res.render("updateForm", {
    title: "Update Game",
    id: game.id,
    name: game.name,
    platform: game.platform,
    genre: game.genre,
    image: game.image,
    errors: null
  });
});

const submitUpdateGame = asyncHandler(async(req, res) => {
  const game = await query.getGameById(req.params.id);
  const result = validationResult(req);

  if (result.isEmpty()) {
    let gameURL = req.body.gameImg != "" ? req.body.gameImg: "../public/game.png";
    query.updateGame(req.params.id, req.body.gameName, req.body.gamePlatform, req.body.gameGenre, gameURL);
    res.redirect("/library");
  } else {
    res.render("updateForm", {
      title: "Update Game",
      id: game.id,
      name: game.name,
      platform: game.platform,
      genre: game.genre,
      image: game.image,
      errors: result.array()
    });
  }
});

const deletePlatform = asyncHandler(async(req, res) => {
  res.render('delete', {
    title: `Delete Platform`,
    confirm: `/library/delete/platform?platform=${encodeURIComponent(req.query.platform)}`,
    pass: "",
    deletePlatform: req.query.platform,
  });
});

const platformDeleteVerifier = asyncHandler(async(req, res) => {
  const decodedPlatform = decodeURIComponent(req.query.platform);

  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deletePlatform(decodedPlatform);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: `Delete the platform: ${req.query.platform}?`,
      confirm: `/library/delete/platform?platform=${req.query.platform}`,
      pass: "Invalid Password.",
      deletePlatform: decodedPlatform,
    });
  }
})

const deleteGenre = asyncHandler(async(req, res) => {
  res.render('delete', {
    title: "Delete Genre?",
    confirm: `/library/delete/genre?genre=${req.query.platform}`,
    pass: "",
  });
});

const genreDeleteVerifier = asyncHandler(async(req, res) => {
  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deleteGenre(req.query.brand);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: "Delete Genre?",
      confirm: `/library/delete/genre?genre=${req.query.genre}`,
      pass: "Invalid Password.",
    });
  }
})

const deleteGame = asyncHandler(async(req, res) => {
  res.render('delete', {
    title: "Delete Game?",
    confirm: `/library/delete/game?game=${req.query.game}`,
    pass: "",
  });
});

const gameDeleteVerifier = asyncHandler(async(req, res) => {
  if(req.body.deletePass == process.env.ADMINPASSWORD) {
    query.deleteGame(req.query.brand);
    res.redirect("/");
  } else {
    res.render("delete", {
      title: "Delete Game?",
      confirm: `/library/delete/game?game=${req.query.game}`,
      pass: "Invalid Password.",
    });
  }
})


module.exports = {
  getGames,
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