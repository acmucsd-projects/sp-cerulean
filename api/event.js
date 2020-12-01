const { db } = require("../db");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**
 * GET Route that handles single event attendance
 * @param eventId the ID of the event
 * @returns json object with number of attendances and number of staff members
 */
router.get("/eventAttend/:eventId", async (req, res) => {
  let attendanceCount = 0;
  let staffMembers = 0;
  try {
    db.query("SELECT * FROM attendance WHERE event_id = $1", [req.params.eventId], (error, response) => {
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

/**
 * GET route which returns an event's attendees' mean and median number of points.
 *
 * @param eventId The ID of the event.
 * @returns A JSON object with the mean and median point values.
 */
router.get("/averagePoints/:eventId", async (req, res) => {
  const queryString = "WITH attendee (uuid) AS (SELECT (user_id) FROM attendance WHERE event_id = $1)"
    + " SELECT (points) FROM usertable WHERE uuid IN (SELECT * FROM attendee)";

  try {
    db.query(queryString, [req.params.eventId], (error, response) => {
      if (error) {
        throw error;
      }

      const points = response.rows.map(row => parseInt(row.points));

      if (points.length === 0) {
        res.status(200).json({
          meanPoints: null,
          medianPoints: null,
        });
      } else {
        // Sort numerically.
        points.sort((a, b) => a - b);

        // Divide the sum by the number of elements.
        const mean = points.reduce((a, b) => a + b, 0) / points.length;

        const middleIndex = Math.floor(points.length / 2);
        const median = (points.length % 2 == 0)
          ? (points[middleIndex] + points[middleIndex + 1]) / 2
          : points[middleIndex];

        res.status(200).json({
          meanPoints: mean,
          medianPoints: median,
        })
      }

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

module.exports = router;
