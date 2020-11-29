const dbAccess = require("../db");
const express = require("express");
const router = express.Router();
/**
 * GET Route that finds attendance by hour (0-23)
 * @param hour takes in a hour
 * @returns json object with number of attendances in that hour
 */
router.get("/eventAttend/:hour", async (req, res) => {
  let hourCount = 0;
  try {
    dbAccess.db.query("SELECT * FROM attendance", (error, response) => {
      response.rows.forEach((value) => {
        if (value.attendance_time.getHours() == req.params.hour) {
          hourCount++;
        }
      });
      res.status(200).json({
        numberOfAttendances: hourCount
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

module.exports = router;
