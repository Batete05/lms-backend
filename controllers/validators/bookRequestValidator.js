const Joi = require("joi");

const validateBookRequest = (data) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid("pending", "approved", "rejected")
      .optional(),

    studentName: Joi.string()
      .min(3)
      .max(100)
      .required(),

    bookName: Joi.string()
      .min(3)
      .max(100)
      .required(),
  });

  return schema.validate(data);
};

module.exports = validateBookRequest;
