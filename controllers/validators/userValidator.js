const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const validateUser = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().label("Full Name"),
    email: Joi.string().required().label("Email"),
    phone: Joi.number().required().label("Phone Number"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("ADMIN", "STUDENT").default("STUDENT") // <-- allow role
  });

  return schema.validate(data);
};

const validatePasswordComplexity = (data) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().label("Email/Phone"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = {
  validateLogin,
  validatePasswordComplexity,
  validateUser,
};
