const errorHandler = (err) => {
  if (err.message.startsWith("Signup Error")) {
    err.status = 422;
    return err;
  }
  if (err.message.startsWith("Category Error")) {
    err.status = 422;
    return err;
  }
  if (err.message.startsWith("Course Error")) {
    err.status = 422;
    return err;
  }
  if (err.message.startsWith("Update Error")) {
    err.status = 422;
    return err;
  }
  switch (err.message) {
    case "you are already logged in":
      err.status = 409;
      return err;
    case "invalid username or password":
      err.status = 403;
      return err;
    case "authorization failed, You are not authorized to complete this action!":
      err.status = 401;
      return err;
    case "Your session has been expired!":
      err.status = 401;
      return err;
    case "This admin already exits":
      err.status = 422;
      return err;
    case "You are currently deactivated by admins":
      err.status = 403;
      return err;
    case "Invalid name":
      err.status = 422;
      return err;
    default:
      err.status = 400;
      err.message = "An error occured";
      return err;
  }
};

module.exports = errorHandler;
