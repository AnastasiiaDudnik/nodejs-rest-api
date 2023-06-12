const fs = require("fs").promises;
const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const User = require("../models/user");

const { HttpError, imageResize, sendEmail } = require("../helpers");
const { controllerWrap } = require("../decorators");

const { SECRET_KEY, PROJECT_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatar = gravatar.profile_url(email);
  const varificationCode = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: avatar,
    verificationToken: varificationCode,
  });

  const varifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${varificationCode}">Click to verify email</a>`,
  };

  await sendEmail(varifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const comparePassword = bcrypt.compare(password, user.password);

  if (!user || !comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(
      401,
      `Unable to login without email verification. Please verify your email ${email} first`
    );
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user.id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: "starter",
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, `User with id "${_id}" not found`);
  }

  if (!["starter", "pro", "business"].includes(subscription)) {
    throw HttpError(400, `Invalid subscription value: ${subscription}`);
  }

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("movies", filename);
  imageResize(newPath, 250);

  const result = await User.findByIdAndUpdate(
    _id,
    { avatarURL: avatar },
    {
      new: true,
    }
  );

  res.json({ avatarURL: result.avatarURL });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204);
};

module.exports = {
  register: controllerWrap(register),
  verify: controllerWrap(verify),
  login: controllerWrap(login),
  getCurrent: controllerWrap(getCurrent),
  updateSubscription: controllerWrap(updateSubscription),
  updateAvatar: controllerWrap(updateAvatar),
  logout: controllerWrap(logout),
};
