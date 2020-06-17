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
      res.json({ newUser, token });
    } catch (err) {
      throw new Error("Signup Error, This user already exits");
    }
  };
  //login function
  const login = async (req, res, next) => {
    const { username, password } = req.body;
    const user = await getUser(username);
    if (user) {
      try {
        await user.comparePassword(password);
        const token = await user.generateToken();
        if (!token) throw new Error("An error occured");
        res.json({ user, token });
      } catch (err) {
        throw new Error("invalid username or password");
      }
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
      score: { ...(lt && { $lt: lt }), ...(gt && { $gt: gt }) },
    };
    const users = await UserModel.find(search)
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    res.json({ users });
  };
  //update user's data
  const update = async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findOneAndUpdate({ _id: id }, req.body);
    res.json({ user });
  };

  //enroll in course
  const enroll = async (req, res, next) => {
    const { id, cid } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $push: { courses: cid } }
    );
    res.json({ user });
  };

  //leave a course
  const leave = async (req, res, next) => {
    const { id, cid } = req.params;
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $pull: { courses: cid } }
    );
    res.json({ user });
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
    res.json({ user });
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
