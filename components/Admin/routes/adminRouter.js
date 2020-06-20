const express = require("express");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");
const checkIfAdmin = require("../../../middlewares/CheckingIfAdmin");
const adminController = require("../controllers");
const authController = require("../../Auth/controllers")();
const {
  vaildateSignup,
  vaildateUpdateUserData,
} = require("../../Auth/validations");
adminRouter = express.Router();

// route to authenticate admin token
adminRouter.get("/", authorizeAdminToken, adminController.get);

//admin login
adminRouter.post("/login", checkIfAdmin, authController.login);
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
