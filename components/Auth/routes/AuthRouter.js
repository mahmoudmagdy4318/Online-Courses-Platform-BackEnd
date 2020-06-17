const express = require("express");
const authController = require("../controllers")();
const { vaildateSignup, vaildateUpdateUserData } = require("../validations");
const alreadyLoginnedMiddleware = require("../../../middlewares/alreadyLoginnedMiddleware");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");
const authorizeUser = require("../../../middlewares/UserAthorizationMiddleware");
const checkIfActiveUser = require("../../../middlewares/checkIfActiveMiddleware");

authRouter = express.Router();

authRouter.post(
  "/register",
  alreadyLoginnedMiddleware,
  vaildateSignup,
  authController.register
);

authRouter.post(
  "/login",
  checkIfActiveUser,
  alreadyLoginnedMiddleware,
  authController.login
);

//get all users
authRouter.get("/", authorizeAdminToken, authController.get);

//update user's data
authRouter.patch("/:id", vaildateUpdateUserData, authController.update);

//enroll in course
authRouter.post(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUser,
  vaildateUpdateUserData,
  authController.enroll
);

//leave a course
authRouter.delete(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUser,
  vaildateUpdateUserData,
  authController.leave
);

//get user's registered Courses
authRouter.get(
  "/:id/courses",
  checkIfActiveUser,
  authorizeUser,
  authController.getRegisteredCourses
);

//get user's finished courses
authRouter.get(
  "/:id/finished",
  checkIfActiveUser,
  authorizeUser,
  authController.getFinishedCourses
);

//finish a course
authRouter.patch(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUser,
  vaildateUpdateUserData,
  authController.finish
);

module.exports = authRouter;
