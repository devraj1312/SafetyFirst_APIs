import createConnection from "../utils/connection.js";

export const createUser = (userData, callback) => {
  (async () => {
    const db = await createConnection(); // Establish a connection
    try {
      const [existingUser] = await db.execute(
        "SELECT * FROM users WHERE phone_no = ? OR email = ?",
        [userData.phone_no, userData.email]
      );
      
      if (existingUser.length > 0) {
        // If the user already exists (phone_no or email match), return an error
        return callback(
          new Error("User with this phone number or email already exists.")
        );
      }

      // Step 2: Insert the new user data if validation passes
      const sql = `INSERT INTO users (name, email, phone_no, created_at) VALUES (?, ?, ?, ?)`;
      const params = [
        userData.name,
        userData.email,
        userData.phone_no,
        userData.createdAt,
      ];

      const [results] = await db.execute(sql, params); // Execute the SQL query
      console.log("Query executed successfully."); // Log success message
      callback(null, results); // Pass results to the callback
    } catch (err) {
      callback(err); // Handle errors
    } finally {
      await db.end(); // Ensure the connection is closed
      console.log("Database connection closed.");
    }
  })();
};
// export default createUser;

export const findUserByPhoneNumber = async (phone_no) => {
  const sql = "SELECT * FROM users WHERE phone_no = ?";
  const params = [phone_no];
  // console.log(params);

  const db = await createConnection(); // Establish a connection
  try {
    // Execute the query
    const [rows] = await db.execute(sql, params);
    console.log("Query executed successfully.");

    if (rows.length === 0) {
      console.log("No user found with the given phone number.");
      return null; // No user found with the phone number
    }

    return rows[0];    // Return the first result, if any
  } catch (err) {
    console.error("Error executing query:", err);
    // throw err; // Re-throw the error to the caller
  } finally {
    if (db) {
      await db.end();  // Ensure the connection is closed
      console.log("Database connection closed.");
    }
  }
};
