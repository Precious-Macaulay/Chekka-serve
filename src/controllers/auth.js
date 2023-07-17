const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// Sign up a new user and send OTP via SMS
exports.signup = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);

  const { phone_number, first_name, last_name, business_name } = req.body;

  // Check if the user already exists in the database
  // If the user exists and has verified OTP, return an error
  const existingUser = await User.findOne({ phone_number });
  if (existingUser && existingUser.is_verified) {
    return res
      .status(409)
      .json({ error: "User with this phone number already exists." });
  }
  // Check if the user already exists in the database but has not verified OTP
  if (existingUser && !existingUser.is_verified) {
    // Generate OTP and set its expiration time for the existinguser
    existingUser.generateOTP();

    // Save the user to the database
    await existingUser.save();

    // Send the OTP via SMS
    existingUser.sendOTPViaSMS();

    return res.status(409).json({
      error:
        "User with this phone number already exists. Please verify OTP sent",
      otp: existingUser.otp,
      phone_number: existingUser.phone_number,
    });
  }

  const user = new User({ phone_number, first_name, last_name, business_name });
  // Generate OTP and set its expiration time for the user
  user.generateOTP();

  // Save the user to the database
  await user.save();

  // Send the OTP via SMS
  user.sendOTPViaSMS();

  // Respond with success
  res.status(200).json({
    message: "Signup successful. OTP sent to your phone number.",
    phone_number: user.phone_number,
    otp: user.otp,
  });
});

// Verify the OTP provided by the user
exports.verifyotp = asyncHandler(async (req, res) => {
  console.log("req.body", req.body);
  const { phone_number, otp } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ phone_number });
  if (!user) {
    return res
      .status(404)
      .json({ error: "User not found. Please sign up first." });
  }

  // Verify the provided OTP
  const isOTPValid = user.verifyOTP(otp);
  if (!isOTPValid) {
    return res.status(401).json({ error: "Invalid OTP. Please try again." });
  }

  // Check if the OTP has expired
  if (user.otp_expires_at < new Date()) {
    return res.status(401).json({
      error: "OTP expired. Please request for new otp",
      phone_number: user.phone_number,
    });
  }

  if (!user.is_verified) {
    user.is_verified = true;
  }

  // Mark the OTP as verified and save the user
  user.is_otp_verified = true;

  // remove the otp from the user
  user.otp = undefined;
  user.otp_expires_at = undefined;
  await user.save();

  // Respond with success
  res
    .status(200)
    .json({ message: "OTP verification successful." });
});

// Create a new Pin

exports.createpin = asyncHandler(async (req, res) => {
  const { phone_number, pin } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ phone_number });
  if (!user) {
    return res
      .status(404)
      .json({ error: "User not found. Please sign up first." });
  }

  // Make sure the user has verified the OTP
  if (!user.is_otp_verified) {
    return res.status(403).json({ error: "Please verify OTP first." });
  }

  // Save the provided PIN
  user.pin = pin;
  user.is_otp_verified = false;
  await user.save();

  // Respond with success
  res
    .status(200)
    .json({ message: "PIN creaated successfully." });
});

exports.login = asyncHandler(async (req, res) => {
  const { phone_number, pin } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ phone_number });
  if (!user) {
    return res
      .status(404)
      .json({ error: "User not found. Please sign up first." });
  }

  // Make sure the user has verified the OTP
  if (!user.is_verified) {
    return res.status(403).json({ error: "Please verify OTP first." });
  }

  // Make sure the user has provided the PIN
  if (!user.pin) {
    return res.status(403).json({ error: "Please create PIN first." });
  }

  console.log("user", user);

  // Check if the provided PIN matches the PIN in the database
  const verifiedUser = await user.verifyCredentials(phone_number, pin);
  if (verifiedUser === null) {
    return res.status(401).json({ error: "Invalid PIN. Please try again." });
  }

  // Generate a JWT token and send it as a response
  const token = jwt.sign({ _id: verifiedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  // Respond with success
  res.status(200).json({ token, message: "Login successful." });
});

// Request a new OTP via SMS

exports.requestotp = asyncHandler(async (req, res) => {
  const { phone_number } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ phone_number });

  if (!user) {
    return res
      .status(404)
      .json({ error: "User not found. Provide a correct phone number" });
  }

  // Generate OTP and set its expiration time for the user
  user.generateOTP();

  // Save the user to the database
  await user.save();

  // Send the OTP via SMS
  user.sendOTPViaSMS();

  // Respond with success
  res.status(200).json({
    message: "OTP sent to your phone number.",
    phone_number: user.phone_number,
    otp: user.otp,
  });
});
