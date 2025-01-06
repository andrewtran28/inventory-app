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
app.use("/library/new", indexRouter);
// app.use("/library/delete", indexRouter);
app.use("/library/update:id", indexRouter);

// app.get("*",(req, res) => {
//     res.render("./views/errors/error404.ejs") 
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Express app - listening on port http://localhost:${PORT}`);
});
