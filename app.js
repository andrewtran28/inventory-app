const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/library", indexRouter);
app.use("/game", indexRouter);

app.use((req, res) => {
    res.status(404).render("error404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express app - listening on port http://localhost:${PORT}`);
});
