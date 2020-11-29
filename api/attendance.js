const { db } = require("../db");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
/**
 * GET Route that handles single event attendance
 * @param eventName takes in an event name
 * @returns json object with number of attendances and number of staff members
 */
router.get("/eventAttend/:eventName", auth, async (req, res) => {
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

/**
 * GET Route that finds attendance by hour (0-23)
 * @param hour takes in a hour
 * @returns json object with number of attendances in that hour
 */
router.get("/eventAttendHour/:hour", async (req, res) => {
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

/**
 * GET Route that finds attendance by day
 *     Sunday - Saturday : 0 - 6
 * @param day takes in a week
 * @returns json object with number of attendances on that day of the week
 */
router.get("/eventAttendDay/:day", async (req, res) => {
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

/**
 * GET Route that returns all events
 * @returns json object info on all events
 */
router.get("/getEvents", async (req, res) => {
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
