const randomatic = require("randomatic");
const { OneTimeCode } = require("../models/oneTimeCode");

function generateCode() {
  return randomatic("0", 5);
}

async function generateOneTimeCode(email) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes

  await OneTimeCode.create({
    email,
    code,
    expiresAt,
  });

  return code;
}

async function validateOneTimeCode(email, code) {
  const now = new Date();

  const result = await OneTimeCode.findOne({ where: { email, code } });

  if (!result) {
    return {
      valid: false,
      message: "No record found with the provided email and code",
    };
  } else if (result.isUsed) {
    return { valid: false, message: "Code has already been used" };
  } else if (result.expiresAt <= now) {
    return { valid: false, message: "Code has expired. Request another." };
  } else {
    result.isUsed = true;
    await result.save();

    return { valid: true, message: "Email verified Successfully" };
  }
}

module.exports = { generateOneTimeCode, validateOneTimeCode };
