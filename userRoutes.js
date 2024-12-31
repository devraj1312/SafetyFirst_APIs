import express from 'express';
import { registerUser,requestOtp, verifyOtp, getUserDetails, logoutUser } from '../controllers/userController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/request-otp', requestOtp);
router.post('/verify-otp', requireAuth, verifyOtp );
router.get("/details", getUserDetails);
router.post('/logout', logoutUser);

export default router;
