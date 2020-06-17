const UserModel = require("../components/Auth/models/UserModel");

const authorizeUser = async function (req, res, next) {
  console.log(UserModel);
  if (!req.headers.authorization)
    throw new Error(
      "authorization failed, You are not authorized to complete this action!"
    );
  else {
    const token = req.headers.authorization;
    const currentUser = await UserModel.getCurrentUserFromToken(token);
    if (currentUser.role !== "user")
      throw new Error(
        "authorization failed, You are not authorized to complete this action!"
      );
    req.currentUser = currentUser;
    next();
  }
};

module.exports = authorizeUser;
