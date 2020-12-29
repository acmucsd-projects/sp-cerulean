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
 * Generate a randomized event date.
 *
 * @return An event date.
 */
randomEventDate = () => {
    const isWeekend = [true, false, false, false, false, false, true];

    let date;

    do {
        date = new Date(
            2020,
            Math.floor(Math.random() * 6),
            Math.floor(Math.random() * 28)
        );
    } while (isWeekend[date.getDay()]);

    return date;
}

main = async () => {
    fakeData = JSON.parse(fs.readFileSync(filename));
    fakeDates = JSON.parse(fs.readFileSync("fake-dates.json"));
    fakeTitles = JSON.parse(fs.readFileSync("fake-titles.json"));

    for (const user of fakeData.users) {
        user.points = Math.floor(100 * Math.random()).toString();
    }

    for (const ev of fakeData.events) {
        const dateIndex = Math.floor(Math.random() * fakeDates.length);

        const startDate = new Date(fakeDates[dateIndex].start);
        const endDate = new Date(fakeDates[dateIndex].end);

        const randomDate = randomEventDate();
        for (const date of [startDate, endDate]) {
            date.setFullYear(randomDate.getFullYear());
            date.setMonth(randomDate.getMonth());
            date.setDate(randomDate.getDate());
        }
        ev.start = startDate.toISOString();
        ev.end = endDate.toISOString();

        const titleIndex = Math.floor(Math.random() * fakeTitles.length);
        ev.title = fakeTitles[titleIndex];
    }

    await dbAccess.connectToPG();

    // DANGER: delete existing data before inserting fake data.
    console.log("DELETING ALL DATA");
    await dbAccess.db.query("DELETE FROM " + USER_TABLE);
    await dbAccess.db.query("DELETE FROM " + EVENT_TABLE);
    await dbAccess.db.query("DELETE FROM " + ATTENDANCE_TABLE);

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
}

main();
