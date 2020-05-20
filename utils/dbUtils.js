const UserModel = require("../models/user");

const insertUseriFNotExists = async () => {
  const user = await UserModel.findOne({}).exec();
  if (user == null) {
    const model = new UserModel({
      name: "admin",
      password: "123456",
    });
    model.save();
  }
};

module.exports = {
  insertUseriFNotExists,
};
