// routes/customerRoutes.js
import express from 'express';
import {addCustomer, updateCustomerProfile, getCustomers} from '../controllers/customerController.js';

const router = express.Router();

// Route to create a new customer
router.post('/add', addCustomer);
router.put('/update', updateCustomerProfile);
router.get("/get", getCustomers);



export default router; // Export the router to be used in the main app
