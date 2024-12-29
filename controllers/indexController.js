const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");

const renderIndex = (req, res) => {
    res.render("index", { title: "Homepage" });
}

module.exports = { renderIndex };