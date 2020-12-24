const fs = require("fs");
const dbAccess = require("./db");

const filename = "./fake-data.json";

// Database table names.
const USER_TABLE = "usertable";
const EVENT_TABLE = "eventtable";
const ATTENDANCE_TABLE = "attendance";

/**
 * Create an INSERT query from an object which has key-value pairs corresponding
 * to column names and column values.
 * 
 * @param tableName The name of the table to insert into.
 * @param rowObj    An object representing the row to insert.
 * @return          An array of arguments which can be spread into query().
 */
makeInsertQuery = (tableName, rowObj) => {
    const columnNames = [];
    const queryArguments = [];

    for (const [key, value] of Object.entries(rowObj)) {
        columnNames.push(key);
        queryArguments.push(value);
    }

    // Generate a string "$1, $2, ..." with the right number of parameters.
    const queryParameters = Array.from(
        queryArguments,
        (x, i) => "$" + (i + 1)
    ).join(", ");

    const queryString = `INSERT INTO ${tableName}`
        + ` (${columnNames.join(", ")})`
        + ` VALUES (${queryParameters})`;

    return [queryString, queryArguments];
}

rateLimit = async (message) => {
    await sleep(100);
    console.log(message);
}

/**
 * Return whether a table is empty.
 * 
 * @param client    The database client.
 * @param tableName The table to query.
 * @return          Whether the table is empty.
 */
tableIsEmpty = async (client, tableName) => {
    const result = await client.query(`SELECT * FROM ${tableName} LIMIT 1`);
    return result.rows.length === 0;
}

sleep = async(timeout) => {
    await new Promise(resolve => setTimeout(resolve, timeout))
}

/**
 * Generate randomized event start and end dates.
 *
 * @return An array with two strings representing the start and end dates.
 */
randomEventStartEnd = () => {
    const today = new Date();

    const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        Math.round(today.getDate() + (10 * Math.random())),
        Math.round(8 + (16 * Math.random())),
        15 * Math.round(4 * Math.random())
    );

    const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes() + 15 * Math.round(1 + 8 * Math.random())
    );

    return [startDate.toISOString(), endDate.toISOString()];
}

fs.readFile(filename, "utf-8", async function(err, data) {
    if (err) throw err;
    const fakeData = JSON.parse(data);

    fs.readFile("fake-dates.json", "utf-8", async function(err2, data2) {
        if (err2) throw err2;
        const fakeDates = JSON.parse(data2);

        for (const user of fakeData.users) {
            user.points = Math.floor(100 * Math.random()).toString();
        }

        for (const ev of fakeData.events) {
            const dateIndex = Math.round(1 + Math.random() * (fakeDates.length - 3));
            ev.start = new Date(fakeDates[dateIndex].start).toISOString();
            ev.end = new Date(fakeDates[dateIndex].end).toISOString();
        }

        await dbAccess.connectToPG();

        /*
        // DANGER: delete existing data before inserting fake data.
        console.log("DELETING ALL DATA");
        await dbAccess.db.query("DELETE FROM " + USER_TABLE);
        await dbAccess.db.query("DELETE FROM " + EVENT_TABLE);
        await dbAccess.db.query("DELETE FROM " + ATTENDANCE_TABLE);
        */

        // Ensure that all tables are empty before proceeding.
        for (const table of [USER_TABLE, EVENT_TABLE, ATTENDANCE_TABLE]) {
            if (!(await tableIsEmpty(dbAccess.db, table))) {
                throw new Error(`Table '${table}' already contains data.`
                    + " Fake data will not be inserted.");
            }
        }

        for (const user of fakeData.users) {
            const row = {
                uuid: user.uuid,
                email: user.email,
                firstname: user.firstName,
                lastname: user.lastName,
                graduationyear: user.graduationYear.toString(),
                major: user.major,
                points: user.points,
            };

            await dbAccess.db.query(...makeInsertQuery(USER_TABLE, row));

            rateLimit(`user ${JSON.stringify(row, null, 2)}`);
        }

        for (const ev of fakeData.events) {
            const row = {
                uuid: ev.uuid,
                eventstart: ev.start,
                eventend: ev.end,
                organization: ev.organization,
                title: ev.title,
                description: ev.description,
                eventlocation: ev.location,
            };

            await dbAccess.db.query(...makeInsertQuery(EVENT_TABLE, row));

            rateLimit(`event ${JSON.stringify(row, null, 2)}`);
        }

        eventsByUuid = {};
        for (const ev of fakeData.events) {
            eventsByUuid[ev.uuid] = ev;
        }

        for (const attendance of fakeData.attendances) {
            const timestamp = new Date(eventsByUuid[attendance.eventUuid].start);
            timestamp.setMinutes(timestamp.getMinutes() + Math.round(5 * Math.random()));

            const row = {
                user_id: attendance.userUuid,
                event_id: attendance.eventUuid,
                attendance_time: timestamp.toISOString(),
                as_staff: attendance.asStaff.toString(),
            };

            await dbAccess.db.query(...makeInsertQuery(ATTENDANCE_TABLE, row));

            rateLimit(`attendance ${JSON.stringify(row, null, 2)}`);
        }

        console.log("Fake data inserted.");
    });
});