const checkForLoginned = function (req, res, next) {
  if (req.headers.authorization) throw new Error("you are already logged in");
  next();
};

module.exports = checkForLoginned;
