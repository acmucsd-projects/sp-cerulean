const dbAccess = require("../db");
const express = require("express");
const router = express.Router();
/**
 * GET Route that handles single event attendance
 * @param eventId the ID of the event
 * @returns json object with number of attendances and number of staff members
 */
router.get("/eventAttend/:eventId", async (req, res) => {
  let attendanceCount = 0;
  let staffMembers = 0;
  try {
    dbAccess.db.query("SELECT * FROM attendance WHERE id = $1", [req.params.eventId], (error, response) => {
      response.rows.forEach((value) => {
        attendanceCount++;
        if (value.asstaff === "true") {
          staffMembers++;
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