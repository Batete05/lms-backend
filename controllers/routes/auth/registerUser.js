const router = require("express").Router();
const { User } = require("../../../models/user");
const { validateUser } = require("../../validators/userValidator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../../../utils/mailer");

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    console.log("============================  1===========");

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
        console.log("============================ 2 ===========");

    const existingUserByPhone = await User.findOne({
      where: { phone: req.body.phone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "That email is already in use" });
    }
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "That phone number is already registered" });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("============================  before sending email===========");
    try {
      await sendEmail(req.body.email, {
        type: "INITIAL_VERIFICATION",
        message: "",
      });
    } catch (error) {
      console.log(error.message)
    }

    console.log("============================  after sending email===========");
    

    const user = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      role: req.body.role ? req.body.role : "STUDENT",
      isVerified: false,
    });

    return res
      .status(201)
      .json({ message: "Validation code sent. check your email" });
  } catch (err) {
    return res.status(500).json({ message:"this is the error "+ err.message });
  }
});

module.exports = router;
