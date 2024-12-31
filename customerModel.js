import createConnection from "../utils/connection.js";

// Add a new customer
export const insertCustomer = (customerData, callback) => {

  // console.log("Customer Data:", customerData);

    (async () => {
      const db = await createConnection(); // Establish a connection
      try {
        // Step 1: Check if the customer already exists based on phone number or vehicle registration number
        const [existingCustomer] = await db.execute(
          "SELECT * FROM customers WHERE phone_no = ? OR vehicle_registration_number = ?",
          [customerData.phone_number || null, customerData.vehicle_registration_number || null]
        );
        
        if (existingCustomer.length > 0) {
            // If the customer already exists, return an error
            return callback(new Error("Customer are already register."));
          }
          
          // Step 2: Insert the new customer data if validation passes
          const sql = `INSERT INTO customers (customer_id, name, phone_no, vehicle_registration_number,created_by, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`;

          const params = [
            customerData.customer_id,
            customerData.name,
            customerData.phone_no,
            customerData.vehicle_registration_number,
            customerData.created_by,
            customerData.createdAt,
          ];
          
          const [results] = await db.execute(sql, params); // Execute the SQL query
          console.log("Query executed successfully."); // Log success message
          callback(null, results); // Pass results to the callback
      } catch (err) {
        console.log(err)
        callback(err); // Handle errors
      } finally {
        await db.end(); // Ensure the connection is closed
        console.log("Database connection closed.");
      }
    })();
  };
  
  
// Update an existing customer's profile
export const updateCustomer = (customerData, callback) => {
    (async () => {
      const db = await createConnection(); // Establish a connection
      try {
        // Step 1: Check if the customer exists in the database
        const [existingCustomer] = await db.execute(
          "SELECT * FROM customers WHERE customer_id = ?",
          [customerData.customer_id]
        );
  
        if (existingCustomer.length === 0) {
          // If the customer does not exist, return an error
          return callback(new Error("Customer not found."));
        }
  
        // Step 2: Update the customer's data
        const sql = `
          UPDATE customers
          SET 
            name = COALESCE(?, name), 
            phone_no = COALESCE(?, phone_no), 
            vehicle_registration_number = COALESCE(?, vehicle_registration_number)
          WHERE customer_id = ?
        `;
        const params = [
          customerData.name || null,
          customerData.phone_no || null,
          customerData.vehicle_registration_number || null,
          customerData.customer_id,
        ];
  
        const [result] = await db.execute(sql, params); // Execute the SQL query
        console.log("Query executed successfully."); // Log success message
  
        callback(null, { affectedRows: result.affectedRows }); // Pass success response to callback
      } catch (err) {
        console.error("Error executing query:", err); // Log error
        callback(err); // Pass error to the callback
      } finally {
        await db.end(); // Ensure the connection is closed
        console.log("Database connection closed.");
      }
    })();
  };
  

  // Fetch customer's profile
  export const getCustomersByCreatorModel = (created_by, callback) => {
    (async () => {
      const db = await createConnection(); // Establish a connection
      try {
        // Step 1: Fetch all customers created by the specific user
        const query = "SELECT * FROM customers WHERE created_by = ?";
        const [results] = await db.execute(query, [created_by]);
  
        console.log("Query executed successfully."); // Log success message
  
        callback(null, results); // Pass the fetched results to the callback
      } catch (err) {
        console.error("Error executing query:", err); // Log error
        callback(err, null); // Pass error to the callback
      } finally {
        await db.end(); // Ensure the connection is closed
        console.log("Database connection closed.");
      }
    })();
  };
  