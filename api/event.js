const { db } = require("../db");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**
 * GET Route that handles single event attendance
 * @param eventId the ID of the event
 * @returns json object with number of attendances and number of staff members
 */
router.get("/eventAttend/:eventId", auth, async (req, res) => {
  let attendanceCount = 0;
  let staffMembers = 0;
  try {
    db.query(
      "SELECT * FROM attendance WHERE event_id = $1",
      [req.params.eventId],
      (error, response) => {
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
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

/**
 * GET route which returns event information.
 * @param startIndex The index of the first event to return (chronological by start time).
 * @param limit The maximum number of events to return.
 * @returns A JSON array with the requested events.
 */
router.get("/eventInfo/:startIndex/:limit", auth, async (req, res) => {
  const queryString =
    "SELECT * FROM eventtable ORDER BY eventstart, uuid LIMIT $1 OFFSET $2";

  try {
    const startIndex = parseInt(req.params.startIndex, 10);
    const limit = parseInt(req.params.limit, 10);

    if (isNaN(startIndex) || isNaN(limit) || startIndex < 0 || limit < 0) {
      res.status(400).send("Invalid start index or limit.");
      return;
    }

    db.query(
      queryString,
      [req.params.limit, req.params.startIndex],
      (error, response) => {
        res.status(200).json(response.rows);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

/**
 * GET route which returns a range of events within a time interval.
 *
 * @param startDate The start of the time interval.
 * @param endDate The end of the time interval.
 * @returns A JSON array with the requested event information and attendance counts.
 */
router.get(
  "/eventInfoDateRange/:startDate/:endDate",
  auth,
  async (req, res) => {
    const eventQueryString =
      "SELECT * FROM eventtable WHERE eventstart BETWEEN $1 AND $2 ORDER BY eventstart";
    const attendanceQueryString =
      "SELECT event_id, COUNT(*) FROM attendance GROUP BY event_id";

    try {
      const events = (
        await db.query(eventQueryString, [
          req.params.startDate,
          req.params.endDate,
        ])
      ).rows;

      const attendanceCounts = await db.query(attendanceQueryString);
      const attendancesById = {};
      for (const row of attendanceCounts.rows) {
        attendancesById[row["event_id"]] = parseInt(row["count"], 10);
      }

      for (const ev of events) {
        ev.attendances = attendancesById[ev.uuid];
      }
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).send("There was an error");
    }
  }
);

/**
 * GET route which returns a range of events within a time interval.
 *
 * @param startDate The start of the time interval.
 * @param endDate The end of the time interval.
 * @returns A JSON array with the requested event information and attendance counts.
 */
router.get(
  "/eventInfoDateRangeWithoutAttendance/:startDate/:endDate",
  auth,
  async (req, res) => {
    const eventQueryString =
      "SELECT * FROM eventtable WHERE eventstart BETWEEN $1 AND $2 ORDER BY eventstart";
    try {
      const events = (
        await db.query(eventQueryString, [
          req.params.startDate,
          req.params.endDate,
        ])
      ).rows;
      res.status(200).json(events);
    } catch (err) {
      console.error(err);
      res.status(500).send("There was an error");
    }
  }
);

/**
 * GET route which returns an event's attendees' mean and median number of points.
 *
 * @param eventId The ID of the event.
 * @returns A JSON object with the mean and median point values.
 */
router.get("/averagePoints/:eventId", auth, async (req, res) => {
  const queryString =
    "WITH attendee (uuid) AS (SELECT (user_id) FROM attendance WHERE event_id = $1)" +
    " SELECT (points) FROM usertable WHERE uuid IN (SELECT * FROM attendee)";

  try {
    db.query(queryString, [req.params.eventId], (error, response) => {
      if (error) {
        throw error;
      }

      const points = response.rows.map((row) => parseInt(row.points));

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
        const median =
          points.length % 2 == 0
            ? (points[middleIndex] + points[middleIndex + 1]) / 2
            : points[middleIndex];

        res.status(200).json({
          meanPoints: mean,
          medianPoints: median,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("There was an error");
  }
});

module.exports = router;
