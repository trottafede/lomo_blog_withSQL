const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

router.get("/", (req, res) => {
  var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Dumbledore@0142",
    database: "ha_blog2021",
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

router.get("*", (req, res) => {
  res.send("Entraste a cualquier lado bro xD");
});

module.exports = router;
