import { createUser, findUserByPhoneNumber } from "../models/userModel.js";
import { generateOtp } from "../utils/otpUtils.js";
import { sendOtp } from "../services/otpService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// USER-REGISTER ==========================================

export const registerUser = async (req, res) => {
  const { name, email, phone_no } = req.body;

  try {
    if (!name || !phone_no || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userData = {
      name,
      email: email, // Email is optional
      phone_no,
      createdAt: new Date(),
    };
    createUser(userData, (err, results) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: "User is already register" });
      }

      res.status(201).json({
        message: "User registered successfully",
        userId: results.insertId,
      });
      console.log("User registered successfully");
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Database Query Error" });
  }
};

// REQUEST OTP ========================
export const requestOtp = async (req, res) => {
  const { phone_no } = req.body;
  if (!phone_no) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  let user = await findUserByPhoneNumber(phone_no);
  if (!user) {
    return res.status(200).json({ message: "User not register" });
  } else {
    try {
      const otp = generateOtp();
      await sendOtp(phone_no, otp);

      // CREATE A SESSIONS
      req.session.otpData = {
        phone_no,
        otp,
        expiresAt: Date.now() + 60 * 60 * 1000, // Expire in 5 minutes
      };

      req.session.user = { phone_no }; // Save phone number in session
      const message = `Your OTP ${otp} Send Successfully`;
      return res.status(200).json({ message });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  }
};

// VERIFY OTP ========================
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res
      .status(400)
      .json({ message: "OTP are required" });
  }

  const otpData = req.session.otpData;

  if (!otpData || otpData.otp !== otp) {
    console.log("Invalid OTP");
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (otpData.expiresAt <= Date.now()) {
    req.session.otpData = null;
    return res
      .status(400)
      .json({ message: "OTP expired. Please request a new one." });
  }

  req.session.otpData = null; // Clear session
  
  // Generate JWT token after successful OTP verification
  const phone_no = req.session.user;

  const payload = {
    phone_no, // or any other user-specific info (e.g., userId, email)
  };

  // Generate a token without an expiration time
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  // console.log("Session after OTP verification:", req.session);

  res.status(200).json({ message: "OTP verified successfully", token });
  console.log("OTP verified successfully");
};

// LOGOUT ========================
export const logoutUser = (req, res) => {

  try {
    // Clear the session to expire the token and session data
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
      console.log("User logged out, session expired.");
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Error during logout" });
  }
};

// GET USER DETAILS =======================================
export const getUserDetails = async (req, res) => {

    // Get the user's phone number from session
    const user = req.session.user;
    const created_by = user?.phone_no; // Extract phone number from session user
  // const { phone_no } = req.body;
  try {
    if (!created_by) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    // Fetch user details from the database using the phone number
    const user = await findUserByPhoneNumber(created_by);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details
    res.status(200).json({
      message: "User details retrieved successfully",
      user: {
        name: user.name,
        email: user.email,
        phone_no: user.phone_no,
      },
    });
    console.log("User details retrieved:", user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
