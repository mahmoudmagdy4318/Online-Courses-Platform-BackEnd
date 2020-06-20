const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt_rounds = Number(process.env.SALT_ROUNDS);
const jwt = require("jsonwebtoken");
const util = require("util");
const uniqueArrayPlugin = require("mongoose-unique-array");

const { Schema } = mongoose;

const UserModel = new Schema({
  username: {
    type: "String",
    required: [true, "username is required"],
    index: { unique: [true, "this username is already taken!"] },
  },
  email: {
    type: "String",
    required: [true, "email is required"],
    index: { unique: [true, "this username is already taken!"] },
  },
  password: { type: "String", required: [true, "password is required"] },
  role: { type: String, default: "user" },
  active: { type: Boolean, default: true },
  score: { type: Number, default: 0 },
  courses: [{ type: mongoose.Schema.ObjectId, ref: "Course" }],
  finishedCourses: [{ type: mongoose.Schema.ObjectId, ref: "Course" }],
});
//add uniqueness to schema arrays
UserModel.plugin(uniqueArrayPlugin);
//pre save hook to encrypt the user's password
UserModel.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, salt_rounds);
    if (!this.password) throw new Error("password error");
  }
});

//function to compare the password when the user try to login
UserModel.methods.comparePassword = function (pass) {
  return bcrypt.compare(pass, this.password);
};

//promisify jwt functions
const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

//generate jwt
UserModel.methods.generateToken = function () {
  return sign(
    {
      _id: JSON.stringify(this._id),
      username: JSON.stringify(this.username),
      email: JSON.stringify(this.email),
      score: JSON.stringify(this.score),
      role: JSON.stringify(this.role),
      active: JSON.stringify(this.active),
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
};
//function to get current user loggedIn from his token
UserModel.statics.getCurrentUserFromToken = async function (token) {
  try {
    const payload = await verify(token, process.env.SECRET_KEY);
    const currentUser = await this.find({
      username: JSON.parse(payload.username),
    });
    currentUser.role = JSON.parse(payload.role);
    currentUser._id = JSON.parse(payload._id);
    currentUser.active = JSON.parse(payload.active);
    if (!currentUser) throw new Error("user not found!");
    currentuser = currentUser[0];
    return currentuser;
  } catch (error) {
    throw new Error(
      "authorization failed, You are not authorized to complete this action!"
    );
  }
};

module.exports = mongoose.model("User", UserModel);
