const dbAccess = require("../db");
const express = require("express");
const router = express.Router();
/**
 * GET Route that returns all events
 * @returns json object info on all events
 */
router.get("/api/event/getEvents", async (req, res) => {
  try {
    dbAccess.db.query("SELECT * FROM eventtable", (error, response) => {
      res.status(200).json({
        events: response.rows
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in retrieving events.");
  }
});

module.exports = router;