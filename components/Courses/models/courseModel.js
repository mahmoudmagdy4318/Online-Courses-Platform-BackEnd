const mongoose = require("mongoose");

const { Schema } = mongoose;

const CourseModel = new Schema(
  {
    name: {
      type: "String",
      required: [true, "category name is required"],
      index: { unique: [true, "this category is already exists!"] },
    },
    description: {
      type: "String",
      required: [true, "category description is required"],
    },
    points: {
      type: "Number",
      required: [true, "category points are required"],
    },
    categories: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Course", CourseModel);
