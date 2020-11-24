const { db } = require("../db");
const express = require("express");
const router = express.Router();
/**
 * GET Route that handles single event attendance
 * @param eventName takes in an event name
 * @returns json object with number of attendances and number of staff members
 */
router.get("/eventAttend/:eventName", async (req, res) => {
  let attendanceCount = 0;
  let staffMembers = 0;
  try {
    db.query("SELECT * FROM attendance", (error, response) => {
      response.rows.forEach((value) => {
        if (value.eventname == req.params.eventName) {
          attendanceCount++;
          if (value.asstaff == "true") {
            staffMembers++;
          }
        }
      });
      res.status(200).json({
        numberOfAttendances: attendanceCount,
        staffMembers: staffMembers,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

module.exports = router;
