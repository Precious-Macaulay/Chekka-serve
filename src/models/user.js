const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { generateOTP } = require("../lib/otp");
const { sendOTPViaSMS } = require("../lib/sms");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  phone_number: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 14,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  pin: {
    type: String,
    trim: true,
  },
  business_name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  otp: {
    type: String,
    trim: true,
    maxlength: 4,
  },
  otp_expires_at: {
    type: Date,
  },
  is_otp_verified: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  deleted_at: {
    type: Date,
  },
});

// Hash the PIN before saving the user
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("pin")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPIN = await bcrypt.hash(user.pin, salt); // Hash the PIN
    user.pin = hashedPIN; // Store the hashed PIN
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.verifyCredentials = async function (phone_number, pin) {
  try {
    // Find the user by phone_number
    const user = await User.findOne({ phone_number });

    // If the user is not found, return null
    if (!user) {
      return null;
    }

    // Compare the provided PIN with the stored hashed PIN
    const isMatch = await bcrypt.compare(pin, user.pin);

    // If the PIN doesn't match, return null
    if (!isMatch) {
      return null;
    }

    // If the user and PIN match, return the user object
    return user;
  } catch (error) {
    // Handle any errors that might occur during the search
    throw new Error("Error finding user by credentials");
  }
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.pin;
  delete userObject.otp;
  delete userObject.otp_expires_at;
  delete userObject.is_verified;
  delete userObject.is_active;
  delete userObject.is_deleted;
  delete userObject.created_at;
  delete userObject.updated_at;
  delete userObject.deleted_at;
  return userObject;
};

// Function to set OTP and its expiration time for the user
userSchema.methods.generateOTP = function () {
  const user = this;
  const otpLength = 4; // You can adjust the OTP length as needed

  // Generate OTP and set its expiration time (e.g., 5 minutes from now)
  user.otp = generateOTP(otpLength);
  user.otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 5 minutes in milliseconds

  // Delete the OTP after 5 minutes
  setTimeout(async () => {
    user.otp = undefined;
    await user.save();
  }, 10 * 60 * 1000);
};

// Function to send the OTP via SMS
userSchema.methods.sendOTPViaSMS = function () {
  const user = this;

  // Send the OTP via SMS
  sendOTPViaSMS(user.phone_number, user.otp);
};

// Function to verify the user-provided OTP
userSchema.methods.verifyOTP = function (userOTP) {
  const user = this;

  // Check if OTP exists and has not expired
  if (!user.otp || user.otp_expires_at < new Date()) {
    return false; // OTP has expired or is not set
  }

  // Compare the user-provided OTP with the stored OTP
  return userOTP === user.otp;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
