const authRouter = require("../components/Auth").authRouter;
const adminRouter = require("../components/Admin").adminRouter;
const categoriesRouter = require("../components/Categories").categoriesRouter;
const coursesRouter = require("../components/Courses").coursesRouter;
const errorHandling = require("../error-handling");
module.exports = {
  authRouter,
  adminRouter,
  errorHandling,
  categoriesRouter,
  coursesRouter,
};
