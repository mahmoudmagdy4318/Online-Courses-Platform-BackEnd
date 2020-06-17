const CourseModel = require("../models");
module.exports = function courseController() {
  //function to get all courses
  const list = async (req, res, next) => {
    //search with query parameters
    const { page, lt, gt } = req.query;
    const search = {
      points: { ...(lt && { $lt: lt }), ...(gt && { $gt: gt }) },
    };
    const courses = await CourseModel.find(search)
      .populate("categories")
      .limit(10)
      .skip((page - 1) * 10)
      .exec();
    res.json({ courses });
  };
  //function to add new course
  const post = async (req, res, next) => {
    try {
      const course = await CourseModel.create(req.body);
      res.json({ course });
    } catch (error) {
      throw new Error("Invalid name");
    }
  };
  //function to get an course
  const show = async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findOne({ _id: id }).populate(
      "categories"
    );
    res.json({ course });
  };
  //function to edit an course
  const update = async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findOneAndUpdate({ _id: id }, req.body);
    res.json({ course });
  };
  //function to delete a course
  const destroy = async (req, res, next) => {
    const { id } = req.params;
    const course = await CourseModel.findOneAndDelete({ _id: id });
    res.json({ course });
  };
  return { list, post, show, update, destroy };
};
