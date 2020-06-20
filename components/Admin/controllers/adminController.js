const UserModel = require("../../Auth/models");
module.exports = function adminController() {
  // get the current authenticated admin
  const get = async (req, res, next) => {
    res.json({ Authorization: "authorized" });
  };
  //create new admin function
  const create = async (req, res, next) => {
    req.body.role = "admin";
    const user = new UserModel(req.body);
    try {
      const newUser = await user.save();
      const token = await newUser.generateToken();
      if (!token) throw new Error("An error occured");
      res.json({ token });
    } catch (err) {
      throw new Error("This admin already exits");
    }
  };

  const updateUserState = async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });
    user.active = !user.active;
    user.save();
    res.json({ message: "edited successfully!" });
  };
  return { get, create, updateUserState };
};
