const express = require("express");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");
const adminController = require("../controllers");
const {
  vaildateSignup,
  vaildateUpdateUserData,
} = require("../../Auth/validations");
adminRouter = express.Router();

//route for ading new admins
adminRouter.post(
  "/",
  authorizeAdminToken,
  vaildateSignup,
  adminController.create
);

//route for updating users' state
adminRouter.patch(
  "/user/:id",
  authorizeAdminToken,
  vaildateUpdateUserData,
  adminController.updateUserState
);
module.exports = adminRouter;
