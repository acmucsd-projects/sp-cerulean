const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
const path = require("path");

//connecting to DB
db.connectToPG();

//server config
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/api/attendance", require("./api/attendance"));

//production environment
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//starting server
app.listen(PORT, () => {
  console.log("Started server on port " + PORT);
});
