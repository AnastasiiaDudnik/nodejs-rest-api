const express = require("express");

const {
  register,
  login,
  getCurrent,
  updateSubscription,
  logout,
} = require("../../controllers/userController");

const { registerSchema, loginSchema } = require("../../schemas/userValidate");
const { validate } = require("../../decorators");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.patch("/", authenticate, updateSubscription);

router.post("/logout", authenticate, logout);

module.exports = router;
