const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");

const getIndex = asyncHandler(async(req, res) => {
    let platforms = await query.getDistinctPlatforms();
    let genres = await query.getDistinctGenres();
    res.render("index", { title: "mingleeDB", platforms: platforms, genres: genres});
    res.end()
});

module.exports = { getIndex };