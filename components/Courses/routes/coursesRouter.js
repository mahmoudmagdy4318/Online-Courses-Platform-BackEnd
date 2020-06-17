const express = require("express");
const coursesController = require("../controllers");
const validateCourse = require("../validations");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");

coursesRouter = express.Router();
//get all courses
coursesRouter.get("/", coursesController.list);
//add new course
coursesRouter.post(
  "/",
  authorizeAdminToken,
  validateCourse,
  coursesController.post
);
//get a course
coursesRouter.get("/:id", coursesController.show);
//update a course
coursesRouter.patch(
  "/:id",
  authorizeAdminToken,
  validateCourse,
  coursesController.update
);
//delete a course
coursesRouter.delete("/:id", authorizeAdminToken, coursesController.destroy);
module.exports = coursesRouter;
