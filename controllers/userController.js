const bcrypt = require("bcrypt");

const User = require("../models/user");

const { HttpError } = require("../helpers");
const { controllerWrap } = require("../decorators");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    email: newUser.email,
    subscription: "starter",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  res.json({
    email: user.email,
    subscription: "starter",
  });
};

module.exports = {
  register: controllerWrap(register),
  login: controllerWrap(login),
};
