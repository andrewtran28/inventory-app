const asyncHandler = require("express-async-handler");
const pool = require("./pool");

const getHome = asyncHandler(async(req, res)=> {
    let platforms = await query.getPlatforms();
    res.render('index', { title: "Homepage", platforms: platforms });
    res.end();
});

module.exports = { getHome };