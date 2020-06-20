const UserModel = require("../models");
const CourseModel = require("../../Courses/models");
const mongoose = require("mongoose");
module.exports = function authController() {
  //helper function to get specific user
  const getUser = (userName) => {
    return UserModel.findOne({ username: userName });
  };
  //registration function
  const register = async (req, res, next) => {
    const user = new UserModel(req.body);
    try {
      const newUser = await user.save();
      const token = await newUser.generateToken();
      if (!token) throw new Error("An error occured");
      res.json({ token });
    } catch (err) {
      throw new Error("Signup Error, This user already exits");
    }
  };
  //login function
  const login = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await getUser(username);
    if (user) {
      const passCmp = await user.comparePassword(password);
      if (!passCmp) throw new Error("invalid username or password");
      const token = await user.generateToken();
      if (!token) throw new Error("An error occured");
      res.json({ token });
    } else {
      throw new Error("user not found!");
    }
  };
  //get all users
  const get = async (req, res, next) => {
    //search for query parameters
    const { page, lt, gt, role } = req.query;
    const search = {
      ...{ role: role || "user" },
      score: { ...(lt && { $lt: lt }), ...{ $gt: gt || -1 } },
    };
    const users = await UserModel.find(
      search,
      "_id username email score active"
    )
      .limit(6)
      .skip((page - 1) * 6)
      .exec();
    const totalNumber = await UserModel.count({ role: "user" });

    res.json({ users, totalNumber });
  };
  //update user's data
  const update = async (req, res, next) => {
    const { id } = req.params;
    await UserModel.findOneAndUpdate({ _id: id }, req.body);
    res.json({ message: "updated successfully" });
  };

  //enroll in course
  const enroll = async (req, res, next) => {
    const { id, cid } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $push: { courses: cid } }
    );
    res.json({ message: "enrolled successfully" });
  };

  //leave a course
  const leave = async (req, res, next) => {
    const { id, cid } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $pull: { courses: cid } }
    );
    res.json({ message: "cancelled successfully" });
  };

  //finish a course
  const finish = async (req, res, next) => {
    const { id, cid } = req.params;

    const coursePoints = await CourseModel.findOne({ _id: cid }, "points");
    const { points } = coursePoints;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        $push: { finishedCourses: cid },
        $pull: { courses: cid },
        $inc: { score: points },
      }
    );
    res.json({ message: "finished successfully" });
  };
  //get user's registered courses
  const getRegisteredCourses = async (req, res, next) => {
    const { id } = req.params;
    const ReisteredCourses = await UserModel.findOne(
      { _id: id },
      "courses"
    ).populate("courses");
    res.json(ReisteredCourses);
  };

  //get user's finished courses
  const getFinishedCourses = async (req, res, next) => {
    const { id } = req.params;
    const finishedCourses = await UserModel.findOne(
      { _id: id },
      "finishedCourses"
    ).populate("finishedCourses");
    res.json(finishedCourses);
  };
  return {
    register,
    login,
    get,
    update,
    enroll,
    leave,
    finish,
    getRegisteredCourses,
    getFinishedCourses,
  };
};
