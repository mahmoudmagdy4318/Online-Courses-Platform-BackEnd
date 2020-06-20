const Joi = require("@hapi/joi");

const categorySchema = Joi.object({
  name: Joi.string().min(6).required(),
});

const vaildateCategory = (req, res, next) => {
  const validation = categorySchema.validate(req.body);
  if (validation.error) {
    throw Error(`Category Error, ${validation.error.message}`);
  }
  next();
};

module.exports = vaildateCategory;
