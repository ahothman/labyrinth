const { Buffer } = require("buffer");
const { HttpError } = require("../errors");
const { EMPTY, FILLED } = require("../config");
const UserModel = require("../models/user");

const authenticationHandler = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return next(
      new HttpError(
        "Authorization is required, Please provide an authorization header with the correct credential",
        401
      )
    );
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );

  const [username, password] = credentials.split(":");

  const user = await UserModel.findOne({
    name: username.toLowerCase(),
    password: password,
  }).exec();
  if (user == null) {
    return next(new HttpError("Authorization failed", 401));
  }
  req.user = user;

  next();
};
const objectIdErrHandler = (err, req, res, next) => {
  if (err.kind && err.kind == "ObjectId") {
    return next(new HttpError("Please provide a valid ID", 400));
  }
  return next(err);
};
const genericErrHandler = (err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({ message });
};

const coordinatesValidaton = (req, res, next) => {
  const x = parseInt(req.params.x, 10);
  const y = parseInt(req.params.y, 10);
  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    return next(new HttpError("coordinates should be an Integer", 400));
  }
  next();
};

const typeValidaton = (req, res, next) => {
  const type = req.params.type.toUpperCase();
  if (type != EMPTY && type != FILLED) {
    return next(
      new HttpError("the type should be either empty or filled", 400)
    );
  }
  next();
};

module.exports = {
  authenticationHandler,
  genericErrHandler,
  objectIdErrHandler,
  coordinatesValidaton,
  typeValidaton,
};
