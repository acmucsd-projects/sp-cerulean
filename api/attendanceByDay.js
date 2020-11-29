const dbAccess = require("../db");
const express = require("express");
const router = express.Router();
/**
 * GET Route that finds attendance by day
 *     Sunday - Saturday : 0 - 6
 * @param day takes in a week
 * @returns json object with number of attendances on that day of the week
 */
router.get("/eventAttend/:day", async (req, res) => {
  let dayCount = 0;
  try {
    dbAccess.db.query("SELECT * FROM attendance", (error, response) => {
      response.rows.forEach((value) => {
        if (value.attendance_time.getDay() == req.params.day) {
         dayCount++;
        }
      });
      res.status(200).json({
        numberOfAttendances: dayCount
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

module.exports = router;
