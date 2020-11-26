const { db } = require("../db");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  //checking if account already exists
  db.query(
    "SELECT username FROM auth WHERE username='" + req.body.username + "'",
    (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send("There was an error with the server");
      } else if (response.rowCount !== 0) {
        res.status(400).send("There is already an account with that email");
      } else {
        //registering user
        const id = uuidv4();
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).send("There was an error with the server");
          } else {
            db.query(
              "INSERT INTO auth VAlUES ('" +
                id +
                "', '" +
                req.body.username +
                "', '" +
                hash +
                "');"
            );
          }
        });

        const token = jwt.sign({ user_id: id }, process.env.JWT_TOKEN);
        res.status(200).send(token);
      }
    }
  );
});

module.exports = router;
