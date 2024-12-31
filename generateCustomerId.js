// Generate customer_id based on the year, month, and a 4-digit sequence
import createConnection from "../utils/connection.js";

export const generateCustomerId = async () => {
  const now = new Date();
  const year = now.getFullYear(); // e.g., 2025
  const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., 02 for February

  const db = await createConnection();
  try {
    // Get the latest customer ID for the current year and month
    const [rows] = await db.query(
      `SELECT customer_id FROM customers WHERE customer_id LIKE ? ORDER BY customer_id DESC LIMIT 1`,
      [`${year}${month}%`]
    );

    let nextSequence = '0001'; // Default sequence number
    if (rows.length > 0) {
      // Convert customer_id to string if necessary
      const lastCustomerId = String(rows[0].customer_id);
      const lastSequence = parseInt(lastCustomerId.slice(-4), 10);
      nextSequence = String(lastSequence + 1).padStart(4, '0');
    }

    return `${year}${month}${nextSequence}`; // e.g., 2025020001
  } catch (error) {
    console.error("Error generating customer ID:", error);
    throw error;
  } finally {
    if (db) {
      await db.end(); // Ensure the connection is closed
    }
  }
};
