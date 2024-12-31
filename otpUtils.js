export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

// export const isOtpExpired = (expiryDate) => {
//   return new Date() > new Date(expiryDate);
// };
