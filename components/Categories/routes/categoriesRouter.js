const express = require("express");
const categoriesController = require("../controllers");
const validateCategory = require("../validations");
const authorizeAdminToken = require("../../../middlewares/adminAuthorizationMiddleware");

categoriesRouter = express.Router();
//get all categories
categoriesRouter.get("/", categoriesController.get);
//add new category
categoriesRouter.post(
  "/",
  authorizeAdminToken,
  validateCategory,
  categoriesController.post
);
//get an category
categoriesRouter.get("/:id", categoriesController.show);
// edit an category
categoriesRouter.patch(
  "/:id",
  authorizeAdminToken,
  validateCategory,
  categoriesController.update
);
//delete an category
categoriesRouter.delete(
  "/:id",
  authorizeAdminToken,
  categoriesController.destroy
);
module.exports = categoriesRouter;
