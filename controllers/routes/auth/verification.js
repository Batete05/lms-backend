const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateOneTimeCode } = require("../../../utils/otpFunctionManager");
const { User } = require("../../../models/user");
const { verifyToken } = require("../../../middlewares/verifyToken");
require("dotenv").config();
// Define a route to handle email verification
router.get("/email", async (req, res) => {
  try {
    const { email, code } = req.query;
    const { valid, message } = await validateOneTimeCode(email, code);
    if (valid) {
      // If the email validation is successful, update the user's isVerified property
      // const  user = await User.findOneAndUpdate(
      //     { email: email },
      //     { $set: { isVerified: true } },
      //     { new: true }
      // );
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        // Handle not found
        return res.status(404).json({ message: "User not found" });
      }

      await user.update({ isVerified: true });

      if (user) {
        return res.status(200).send(`
                    <html>
                        <head><title>Email Verified</title></head>
                        <body>
                            <h1>Email Verified Successfully</h1>
                            <p>Your email (${email}) has been verified.</p>
                            Continue
                            <a href="http://locahost:5173">Employee M S</a>
                        </body>
                    </html>
                `);
      } else {
        return res.status(404).send("User not found");
      }
    } else {
      return res.status(400).send(message);
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});
router.post("/update-email", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const userID = extractUserIdFromToken(req);

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser._id.toString() !== userID) {
        return res
          .status(400)
          .json({ message: "Email is already in use by another user." });
      }
    }

    // Use existingUser if it matches the userID, otherwise fetch user by ID
    const user =
      existingUser && existingUser._id.toString() === userID
        ? existingUser
        : await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "Your account was not found." });
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Invalid password. Please try again." });
    }

    // Generate and send the verification code
    const code = await generateOneTimeCode(email);
    await sendVerificationEmailOnly(email, code);

    return res.status(200).json({
      message:
        "Check your spam emails or Primary Emails for verification code.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "An unexpected error occurred. Please try again later.",
      });
  }
});

router.post("/email-updated", verifyToken, async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required." });
    }

    const userId = extractUserIdFromToken(req);

    // Check if the email exists in the database
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser._id.toString() === userId) {
        // Email already belongs to the same user
        await User.findByIdAndUpdate(
          userId,
          { $set: { isVerified: true } },
          { new: true }
        );
        return res.status(200).json({ message: "Email is already verified." });
      } else {
        // Email belongs to another user
        return res
          .status(400)
          .json({ message: "Email is already in use by another user." });
      }
    }

    // Validate the one-time code
    const { valid, message } = await validateOneTimeCode(
      email,
      verificationCode
    );

    if (!valid) {
      return res.status(400).json({ message });
    }

    // Update email and verification status
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isVerified: true, email } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new token
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        name: user.firstName,
        isVerified: user.isVerified,
      },
      process.env.JWT,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ message: "success", token: token });
  } catch (err) {
    // console.error("Error updating email:", err); // Use a logger in production
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
