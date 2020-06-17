const UserModel = require("../../Auth/models");
module.exports = function adminController() {
  //create new admin function
  const create = async (req, res, next) => {
    req.body.role = "admin";
    const user = new UserModel(req.body);
    try {
      const newUser = await user.save();
      const token = await newUser.generateToken();
      if (!token) throw new Error("An error occured");
      res.json({ newUser, token });
    } catch (err) {
      throw new Error("This admin already exits");
    }
  };

  const updateUserState = async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findOneAndUpdate({ _id: id }, req.body);
    res.json({ user });
  };
  return { create, updateUserState };
};
