const { render } = require("ejs");
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

router.get("/", (req, res) => {
  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  connection.query(
    "SELECT * FROM `seederDB` ",
    function (error, blogs, fields) {
      if (error) throw error;
      res.render("home", { blogs });
    }
  );

  connection.end();
});

router.get("/articulo/:id", (req, res) => {
  let key = req.params.id;

  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  connection.query(
    "SELECT * FROM `seederDB` WHERE `id` = ?",
    [key],
    function (error, data, fields) {
      if (error) throw error;
      let singleBlog = data[0];
      res.render("article", { singleBlog });
    }
  );

  connection.end();
});

router.get("/admin", (req, res) => {
  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  connection.query(
    "SELECT * FROM `seederDB` ",
    function (error, blogs, fields) {
      if (error) throw error;
      res.render("admin", { blogs });
    }
  );

  connection.end();
});

router.get("/admin/updateArticle/:id", (req, res) => {
  let key = req.params.id;
  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  connection.connect();

  let singleBlog = connection.query(
    "SELECT * FROM `seederDB` WHERE `id` = (?)",
    [key],
    function (error, data, fields) {
      if (error) throw error;
      const singleBlog = data[0];
      res.render("updateArticle", { singleBlog });
    }
  );
  connection.end();
});

router.post("/admin/updateArticle", (req, res) => {
  const { id, title, content, author, image } = req.body;
  if (
    title.length <= 255 &&
    title.length >= 5 &&
    content.length <= 21844 &&
    content.length >= 5 &&
    author.length <= 255 &&
    author.length >= 5 &&
    image.length <= 21844 &&
    image.length >= 5
  ) {
    let fecha = new Date();
    let queryString =
      "UPDATE seederDB SET title = ?, content = ?, author = ?, image = ?, createdDate = ? WHERE id = ?";
    let dataArray = [title, content, author, image, fecha, id];

    // create the connection to database
    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    connection.connect(function (err) {
      if (err) throw err;
    });

    // simple query
    connection.query(queryString, dataArray, function (err, results, fields) {
      if (err) throw err;
      res.redirect("/admin");
    });
    connection.end();
  }
});

router.post("/admin/createArticle", (req, res) => {
  let { title, content, author, image } = req.body;

  if (
    title.length <= 255 &&
    title.length >= 5 &&
    content.length <= 21844 &&
    content.length >= 5 &&
    author.length <= 255 &&
    author.length >= 5 &&
    image.length <= 21844 &&
    image.length >= 5
  ) {
    let fecha = new Date();
    let queryString = `INSERT INTO seederDB (title, content, author, image, createdDate) VALUES (?,?,?,?,?)`;
    let dataArray = [title, content, author, image, fecha];

    // create the connection to database
    let connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    connection.connect(function (err) {
      if (err) throw err;
    });

    // simple query
    connection.query(queryString, dataArray, function (err, results, fields) {
      if (err) throw err;
      res.redirect("/admin");
    });
    connection.end();
  }
});

router.get("*", (req, res) => {
  res.send("Entraste a cualquier lado bro xD");
});

module.exports = router;
