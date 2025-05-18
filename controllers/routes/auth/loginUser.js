const router = require("express").Router();
const { User } = require("../../../models/user");
const { sendEmail } = require("../../../utils/mailer");
const {
  validateUser,
  validateLogin,
} = require("../../validators/userValidator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateOneTimeCode } = require("../../../utils/otpFunctionManager");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { err } = validateLogin(req.body);
    if (err) {
      return res.status(400).json({ message: err.details[0].message });
    }

    const email_phone = req.body.email_phone.replace(/\s/g, "");
    const isNumeric = /^\d+$/.test(email_phone);
    let user;
    if (isNumeric) {
      user = await User.findOne({ where: { phone: parseInt(email_phone) } });
    } else {
      user = await User.findOne({ where: { email: email_phone } });
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid Email/Phone or Password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: "Invalid Email/Phone or Password" });
    }

    await sendEmail(user.email, {
      type: "LOGIN_OTP",
      message: "",
    });

    return res.status(201).json({
      message: "Successfully Logged. OTP sent to your email",
    });
  } catch (err) {
    return res.json({ message: "Internal Server error" + err.message });
  }
});

router.post("/otp", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required." });
    }

    const { valid, message } = await validateOneTimeCode(
      email,
      verificationCode
    );

    if (!valid) {
      return res.status(400).json({ message });
    }
       const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Add id and role here
      process.env.JWT,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "OTP verified successfully.",
      token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error: " + err.message });
  }
});

module.exports = router;
