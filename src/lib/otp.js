// otp.js is a helper function that generates a random 4 digit number

// Function to generate a random OTP of specified length
function generateOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    otp += digits[randomIndex];
  }
  return otp;
}

module.exports = { generateOTP };
