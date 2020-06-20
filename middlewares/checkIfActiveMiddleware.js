const UserModel = require("../components/Auth/models/UserModel");
const checkIfActiveUser = async function (req, res, next) {
  if (!req.headers.authorization) {
    const { username } = req.body;
    const user = await UserModel.findOne({ username }, "active");
    if (!user) throw new Error("user not found!");
    const { active } = user;
    if (!active) throw new Error("You are currently deactivated by admins");
    next();
  } else {
    const token = req.headers.authorization;
    const currentUser = await UserModel.getCurrentUserFromToken(token);
    if (!currentUser.active)
      throw new Error("You are currently deactivated by admins");
    req.token = token;
    req.currentUser = currentUser;
    next();
  }
};

module.exports = checkIfActiveUser;
