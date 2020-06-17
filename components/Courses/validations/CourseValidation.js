const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const courseSchema = Joi.object({
  name: Joi.string().min(6).required(),
  description: Joi.string().min(20).required(),
  points: Joi.number().min(50).max(1000).required(),
  categories: Joi.array().items(Joi.objectId()).unique(),
});

const vaildateCourse = (req, res, next) => {
  const validation = courseSchema.validate(req.body);
  if (validation.error) {
    throw Error(`Course Error, ${validation.error.message}`);
  }
  next();
};
module.exports = vaildateCourse;
