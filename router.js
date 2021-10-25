const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const { Client } = require("pg");

router.get("/", (req, res) => {
  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });

  client.query("SELECT * from articles", (err, result) => {
    if (err) throw err;
    let blogs = result.rows;
    res.render("home", { blogs });
    client.end();
  });
});

router.get("/articulo/:id", (req, res) => {
  let key = req.params.id;

  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
  });

  client.query("SELECT * FROM articles WHERE id = $1", [key], (err, result) => {
    if (err) throw err;
    let singleBlog = result.rows[0];
    res.render("article", { singleBlog });
    client.end();
  });
});

router.get("/admin", (req, res) => {
  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
  });

  client.query("SELECT * FROM articles ", (err, result) => {
    if (err) throw err;
    let blogs = result.rows;
    res.render("admin", { blogs });
    client.end();
  });
});

router.get("/admin/updateArticle/:id", (req, res) => {
  let key = req.params.id;
  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
  });

  client.query(
    "SELECT * FROM articles WHERE id = ($1)",
    [key],
    (err, result) => {
      if (err) throw err;
      let singleBlog = result.rows[0];
      res.render("updateArticle", { singleBlog });
      client.end();
    }
  );
});

router.get("/admin/deleteArticle/:id", (req, res) => {
  let { id } = req.params;

  // create the connection to database
  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
  });

  // simple query
  client.query(`DELETE FROM articles WHERE id = ($1)`, [id], (err, result) => {
    if (err) throw err;
    res.redirect("/admin");
    client.end();
  });
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
    const query = {
      text: "UPDATE articles SET title = ($1), content = ($2), author = ($3), image = ($4), created_at = ($5) WHERE id = ($6)",
      values: [title, content, author, image, fecha, id],
    };

    // create the connection to database
    const client = new Client({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    client.connect(function (err) {
      if (err) throw err;
    });
    // simple query
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/admin");
      client.end();
    });
  }
});

router.post("/admin/createArticle", async (req, res) => {
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
    let queryString = `INSERT INTO articles (title, content, author, image, created_at) VALUES ($1,$2,$3,$4,$5)`;
    let dataArray = [title, content, author, image, fecha];

    // create the connection to database
    const client = new Client({
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    client.connect(function (err) {
      if (err) throw err;
    });

    // Nodemail

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_USER,
        pass: process.env.NODE_MAILER_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    let textToSend = `
      Se creó un articulo con el titulo: ${title}.
      El autor del articulo es: ${author}
      Imágen de perfil: ${image}
      El contendio de dicho articulo es:
      ${content}. 
    `;
    const mailOptions = {
      from: process.env.NODE_MAILER_USER,
      to: process.env.NODE_MAILER_USER,
      subject: "Lomoblog - nuevo post",
      text: textToSend,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) throw err;
      console.log("Email sent: " + info.response);
    });

    // simple query
    client.query(queryString, dataArray, (err, result) => {
      if (err) throw err;
      res.redirect("/admin");
      client.end();
    });
  }
});

router.get("/api/articulos", (req, res) => {
  const client = new Client({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  client.connect(function (err) {
    if (err) throw err;
  });

  // simple query
  client.query("SELECT * FROM articles ", (err, result) => {
    if (err) throw err;
    res.json(result.rows);
    client.end();
  });
});

router.get("*", (req, res) => {
  res.send("Entraste a cualquier lado bro xD");
});

module.exports = router;
