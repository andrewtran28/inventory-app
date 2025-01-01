const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");

const getIndex = asyncHandler(async(req, res) => {
    let platform = await query.getDistinctPlatform();
    res.render("index", { title: "Homepage" });
    res.end();
});

module.exports = { getIndex };