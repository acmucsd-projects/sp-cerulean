const express = require("express");
const app = express();

const db = require("./db");

//connecting to DB
db.connectToPG();

//starting server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Started server on port " + PORT);
});

//test query to DB
db.printTableData("test");
