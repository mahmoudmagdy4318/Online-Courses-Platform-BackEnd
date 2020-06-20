const CategoryModel = require("../models");
module.exports = function categoryController() {
  //function to get all categories
  const get = async (req, res, next) => {
    const { page } = req.query;
    const categories = await CategoryModel.find()
      .populate("courses")
      .limit(6)
      .skip((page - 1) * 6)
      .exec();
    const lastPage = await CategoryModel.count();
    res.json({ categories, lastPage: lastPage / 6 });
  };
  //function to add a new category
  const post = async (req, res, next) => {
    try {
      const category = await CategoryModel.create(req.body);
      res.json({ category });
    } catch (error) {
      throw new Error("Invalid name");
    }
  };
  //function to get a category
  const show = async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findOne({ _id: id }).populate(
      "courses"
    );
    res.json({ category });
  };
  //function to edit a category
  const update = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const category = await CategoryModel.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({ category });
  };

  const destroy = async (req, res, next) => {
    const { id } = req.params;
    const category = await CategoryModel.findOneAndDelete({ _id: id });
    res.json({ category });
  };
  //function to delete a category
  return { get, post, show, update, destroy };
};
