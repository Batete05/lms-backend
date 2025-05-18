const Joi = require("joi");

const validateBook = (data) => {
  const schema = Joi.object({
    bookName: Joi.string().required().label("Book Name"),
    author: Joi.string().required().label("Author"),
    publisher: Joi.string().required().label("Publisher"),
    publishedYear: Joi.number().required().label("Publisher"),
    subject:Joi.string().required().label("Subject"),
    bookIsbn:Joi.number().required().label("bookIsbn")
  });
  return schema.validate(data)
};

module.exports={
    validateBook
}