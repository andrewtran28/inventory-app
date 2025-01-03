const asyncHandler = require("express-async-handler");
const query = require("../db/queries.js");

const getIndex = asyncHandler(async(req, res) => {
    let poop = await query.getDistinctPlatforms();
    console.log(poop);
    res.render("index", { title: "Homepage", platforms: poop});
    res.end()
});

// const getIndex = (req,res) => {
//     res.render("index", {title: "Homepage"});
// }

module.exports = { getIndex };