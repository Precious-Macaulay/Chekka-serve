const asyncHandler = require("express-async-handler");
const { Mono } = require("mono-node");
const Bank = require("./../models/bank");

const monoClient = new Mono({
  secretKey: process.env.MONO_SECRET_KEY,
});
// Get account id from mono
exports.monoauth = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { code } = req.body;

  await monoClient.auth.getAccountId({ code: code }, async (err, results) => {
    const accountId = results.id;
    // Save the user to the database
    const bank = new Bank({
      user_id: _id,
      mono_account_id: accountId,
      mono_code: code,
    });

    await bank.save();
    res.json({
      success: true,
    });
  });
});

// Get account details from mono
exports.getBanks = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const banks = await Bank.find({ user_id: _id });

  if (banks.length === 0) {
    // No bank account found
    return res.json({
      success: false,
      message: "No bank account found",
    });
  }

  await monoClient.account.getAccountInformation(
    { accountId: banks[0].mono_account_id },
    (err, result) => {
      res.json({
        success: true,
        income: 253304,
        expense: 32535,
        data: result,
      });
    }
  );
});
