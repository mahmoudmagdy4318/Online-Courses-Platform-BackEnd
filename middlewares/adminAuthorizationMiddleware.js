const UserModel = require("../components/Auth/models/UserModel");
const authorizeAdminToken = async function (req, res, next) {
  if (!req.headers.authorization)
    throw new Error(
      "authorization failed, You are not authorized to complete this action!"
    );
  else {
    const token = req.headers.authorization;
    const currentUser = await UserModel.getCurrentUserFromToken(token);
    if (currentUser.role !== "admin")
      throw new Error(
        "authorization failed, You are not authorized to complete this action!"
      );
    req.currentUser = currentUser;
    next();
  }
};

module.exports = authorizeAdminToken;
