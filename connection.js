import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createConnection() {
  try {
    // Use await to resolve the promise returned by createConnection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("Database connection successfully.");
    return connection;
  } catch (err) {
    console.log("Error connecting to the database:");
  }
}

export default createConnection;
