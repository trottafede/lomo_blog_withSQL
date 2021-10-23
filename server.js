const express = require("express");
const app = express();
const router = require("./router");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 8000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
