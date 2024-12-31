import { insertCustomer, updateCustomer, getCustomersByCreatorModel} from "../models/customerModel.js";
import { generateCustomerId } from "../utils/generateCustomerId.js";

export const addCustomer = async (req, res) => {
  const { name, phone_no, vehicle_registration_number } = req.body;

  // Get the user's phone number from session
  const user = req.session.user; // Assuming session stores user details
  const created_by = user?.phone_no; // Extract phone number from session user

  if (!created_by) {
    return res
      .status(401)
      .json({ message: "User not logged in or session expired" });
  }

  try {
    if (!name || !phone_no || !vehicle_registration_number) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const customerData = {
      customer_id: await generateCustomerId(),
      name,
      phone_no,
      vehicle_registration_number,
      created_by, // This is the phone number from the session
      createdAt: new Date(),
    };

    insertCustomer(customerData, (err, result) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "Failed to add customer", error: err.message }); // Use res for the response
      }

      res.status(201).json({
        message: "Customer added successfully",
        customerId: customerData.customer_id,
      });
      console.log("Customer added successfully");
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Database Query Error" });
  }
};

// Update Customer Profile
export const updateCustomerProfile = async (req, res) => {
  const { name, phone_no, vehicle_registration_number } = req.body;
  const { customer_id } = req.query;

  try {
    if (!customer_id) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    if (!name && !phone_no && !vehicle_registration_number) {
      return res
        .status(400)
        .json({ message: "At least one field to update is required" });
    }

    const updateData = {
      name: name || null,
      phone_no: phone_no || null,
      vehicle_registration_number: vehicle_registration_number || null,
      customer_id,
    };

    updateCustomer(updateData, (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({
          message: "Failed to update customer profile",
          error: err.message,
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
      console.log("Profile updated successfully");
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ error: "Database Query Error" });
  }
};

// Fetch all customers created by the same user
export const getCustomers = async (req, res) => {
  // Get the user's phone number from session
  const user = req.session.user;
  const created_by = user?.phone_no; // Extract phone number from session user

  if (!created_by) {
    return res
      .status(401)
      .json({ message: "User not logged in or session expired" });
  }

  try {
    getCustomersByCreatorModel(created_by, (err, customers) => {
      if (err) {
        console.error(err.message);
        return res
          .status(500)
          .json({ message: "Failed to fetch customers", error: err.message });
      }

      if (customers.length === 0) {
        return res
          .status(404)
          .json({ message: "No customers found for this user" });
      }

      res.status(200).json({
        message: "Customers fetched successfully",
        customers,
      });
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Database Query Error" });
  }
};
