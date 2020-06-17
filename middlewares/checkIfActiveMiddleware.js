const UserModel = require("../components/Auth/models/UserModel");
const checkIfActiveUser = async function (req, res, next) {
  if (!req.headers.authorization) {
    const { username } = req.body;
    const user = await UserModel.findOne({ username }, "active");
    const { active } = user;
    if (active !== "active")
      throw new Error("You are currently deactivated by admins");
    next();
  } else {
    const token = req.headers.authorization;
    const currentUser = await UserModel.getCurrentUserFromToken(token);
    if (currentUser.active !== "active")
      throw new Error("You are currently deactivated by admins");
    req.currentUser = currentUser;
    next();
  }
};

module.exports = checkIfActiveUser;
