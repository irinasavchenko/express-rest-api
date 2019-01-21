const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema ({
  name:  String,
  age: Number,
  friends: Array
}, {
  versionKey: false
});
const User = mongoose.model("User", userScheme); //создаем модель пользователя с названием User

module.exports = User;
