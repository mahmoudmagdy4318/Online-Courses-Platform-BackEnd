const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
require("express-async-errors");
const {
  authRouter,
  adminRouter,
  categoriesRouter,
  coursesRouter,
  errorHandling,
} = require("./startups");

//getting port and databaseUrl from env
const port = process.env.PORT;
const databaseUrl = process.env.DATABASEURL;

app.use(cors());

//database connection
const db = mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.error(error);
  });

//to parse the request body
app.use(json());
app.use(urlencoded({ extended: true }));

//routing for user routes
app.use("/user", authRouter);
//admin routes
app.use("/admin", adminRouter);
// categories Routes
app.use("/categories", categoriesRouter);
//courses Routes
app.use("/courses", coursesRouter);
//errors handling
app.use((err, req, res, next) => {
  const response = errorHandling(err);
  res.status(response.status).json({ err: response.message });
});

//stablishing the connection
const connection = app.listen(port, () => {
  console.log(`courses platform app listenning on port ${port}`);
});
