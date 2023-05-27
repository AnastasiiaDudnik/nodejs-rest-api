const express = require("express");

const {
  register,
  login,
  getCurrent,
} = require("../../controllers/userController");

const { registerSchema, loginSchema } = require("../../schemas/userValidate");
const { validate } = require("../../decorators");
const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

router.get("/current", authenticate, getCurrent);

module.exports = router;
