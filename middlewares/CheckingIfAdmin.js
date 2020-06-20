const UserModel = require("../components/Auth/models/UserModel");
const checkIfAdmin = async function (req, res, next) {
  const { username } = req.body;
  const user = await UserModel.findOne({ username: username }, "role");
  if (user.role !== "admin") throw new Error("invalid username or password");
  next();
};

module.exports = checkIfAdmin;
