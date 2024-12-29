const renderIndex = (req, res) => {
    res.render("index", { title: "Homepage" });
}

module.exports = { renderIndex };