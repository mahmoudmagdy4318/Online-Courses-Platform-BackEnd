const mongoose = require("mongoose");
const CourseModel = require("../../Courses/models");

const { Schema } = mongoose;

const CategoryModel = new Schema({
  name: {
    type: "String",
    required: [true, "category name is required"],
    index: { unique: [true, "this category is already exists!"] },
  },
  // courses: [{ type: mongoose.Schema.ObjectId, ref: "Course" }],
});
CategoryModel.set("toJSON", { virtuals: true });

CategoryModel.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "categories",
});

CategoryModel.pre("findOneAndDelete", async function (next) {
  const id = this.getQuery()._id;
  await CourseModel.updateMany(
    { categories: { $in: [id] } },
    { $pull: { categories: id } }
  );
  next();
});
module.exports = mongoose.model("Category", CategoryModel);
