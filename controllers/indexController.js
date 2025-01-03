const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");

const getIndex = asyncHandler(async(req, res) => {
    let platforms = await query.getDistinctPlatforms();
    let genres = await query.getDistinctGenres();
    console.log(platforms);
    res.render("index", { title: "Homepage", platforms: platforms, genres: genres});
    res.end()
});

module.exports = { getIndex };