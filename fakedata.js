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

fs.readFile(filename, "utf-8", async function(err, data) {
    if (err) {
        throw err;
    }

    const fakeData = JSON.parse(data);

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
            points: Math.floor(100 * Math.random()).toString(),
        };

        await dbAccess.db.query(...makeInsertQuery(USER_TABLE, row));

        rateLimit(`user ${user.uuid}`);
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
        }

        await dbAccess.db.query(...makeInsertQuery(EVENT_TABLE, row));

        rateLimit(`event ${ev.uuid}`);
    }

    for (const attendance of fakeData.attendances) {
        const row = {
            user_id: attendance.userUuid,
            event_id: attendance.eventUuid,
            attendance_time: attendance.timestamp,
            as_staff: attendance.asStaff.toString(),
        };

        await dbAccess.db.query(...makeInsertQuery(ATTENDANCE_TABLE, row));

        rateLimit(`attendance ${attendance.userUuid} ${attendance.eventUuid}`);
    }

    console.log("Fake data inserted.");
});