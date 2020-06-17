const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

const signupSchema = Joi.object({
  username: Joi.string().min(5).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .min(6)
    .required(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().min(5),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .min(6),
  score: Joi.number(),
  active: Joi.string().valid("active", "inactive"),
  courses: Joi.array().items(Joi.objectId()).unique(),
  finishedCourses: Joi.array().items(Joi.objectId()).unique(),
});

const vaildateSignup = (req, res, next) => {
  const validation = signupSchema.validate(req.body);
  if (validation.error) {
    throw new Error(`Signup Error, ${validation.error.message}`);
  }
  next();
};

const vaildateUpdateUserData = (req, res, next) => {
  const validation = updateUserSchema.validate(req.body);
  if (validation.error) {
    throw new Error(`Update Error, ${validation.error.message}`);
  }
  next();
};

const UserValidations = {
  vaildateSignup,
  vaildateUpdateUserData,
};
module.exports = UserValidations;
