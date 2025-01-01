const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");
const { validationResult } = require("express-validator");
const { render } = require("ejs");

const getGames = asyncHandler(async (req, res) => {
    if (Object.keys(req.query).length != 0) {
        let games = await query.getGamesByPlatform(req.query.platform);
        res.render("gamesPage", { title: "Library", games: games });
    } else {
        let games = await query.getAllGames();
        res.render("gamesPage", { title: "Library", games: games });
    }
});

const getNewGameForm = asyncHandler(async (req, res) => {
    res.render("gameForm", {
        title: "New Game",
    });
})

const submitNewGame = asyncHandler(async (req, res) => {
    const result = validationResult(req);
    if(result.isEmpty()) {
        let gameURL = req.body.gameImg != "" ? req.body.gameImg: "../public/game.png";
        query.insertProduct(req.body.gameName, req.body.gamePlatform, req.body.gameGenre, gameURL);
        res.redirect('/');
    } else {
        res.render('gameForm', { title: "New Game" });
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
    });
});

const submitUpdateGame = asyncHandler(async(req, res) => {
    const game = await query.getGameById(req.params.id);
    const result = validationResult(req);

    if (result.isEmpty()) {
        let gameURL = req.body.gameImg != "" ? req.body.gameImg: "../public/game.png";
        query.updateGame(req.params.id, req.body.gameName, req.body.gamePlatform, req.body.gameGenre, gamegameUrl);
        res.redirect("/library");
    } else {
        res.render("updateForm", {
            title: "Update Game",
            id: game.id,
            name: game.name,
            platform: game.platform,
            genre: game.genre,
            image: game.image,
        });
    }
});

const deletePlatform = asyncHandler(async(req, res) => {
    res.render('delete', {
        title: "Delete Platform?",
        confirm: `/library/delete/platform?platform=${req.query.platform}`,
        pass: "",
    });
});

const platformDeleteVerifier = asyncHandler(async(req, res) => {
    if(req.body.deletePass == process.env.ADMINPASSWORD) {
        query.deletePlatform(req.query.brand);
        res.redirect("/");
    } else {
        res.render("delete", {
            title: "Delete Platform?",
            confirm: `/library/delete/platform?platform=${req.query.platform}`,
            pass: "Invalid Password.",
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
        confirm: `/library/delete/product?product=${req.query.game}`,
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