const express = require("express");
const authController = require("../controllers")();
const { vaildateSignup, vaildateUpdateUserData } = require("../validations");
const alreadyLoginnedMiddleware = require("../../../middlewares/alreadyLoginnedMiddleware");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");
const checkIfActiveUser = require("../../../middlewares/checkIfActiveMiddleware");
const authorizeUserActions = require("../../../middlewares/usersActionsAuthorization");

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
authRouter.patch(
  "/:id",
  checkIfActiveUser,
  authorizeUserActions,
  vaildateUpdateUserData,
  authController.update
);

//enroll in course
authRouter.post(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUserActions,
  vaildateUpdateUserData,
  authController.enroll
);

//leave a course
authRouter.delete(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUserActions,
  vaildateUpdateUserData,
  authController.leave
);

//get user's registered Courses
authRouter.get(
  "/:id/courses",
  checkIfActiveUser,
  authorizeUserActions,
  authController.getRegisteredCourses
);

//get user's finished courses
authRouter.get(
  "/:id/finished",
  checkIfActiveUser,
  authorizeUserActions,
  authController.getFinishedCourses
);

//finish a course
authRouter.patch(
  "/:id/courses/:cid",
  checkIfActiveUser,
  authorizeUserActions,
  vaildateUpdateUserData,
  authController.finish
);

module.exports = authRouter;
