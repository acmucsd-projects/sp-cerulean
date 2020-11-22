const { Client } = require("pg");
require("dotenv").config({ path: "./config.env" });

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectToPG = async () => {
  try {
    await db.connect().then(console.log("Connected to DB"));
  } catch (error) {
    console.error(error);
  }
};

const printTableData = (table) => {
  db.query("SELECT * FROM " + table, (error, response) => {
    if (error) {
      console.error(error);
      throw error;
    }
    response.rows.forEach((value) => {
      console.log(value);
    });
  });
};

module.exports = { connectToPG, printTableData, db };
