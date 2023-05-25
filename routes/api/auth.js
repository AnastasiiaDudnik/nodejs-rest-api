const express = require("express");

const { register, login } = require("../../controllers/userController");

const { registerSchema, loginSchema } = require("../../schemas/userValidate");
const { validate } = require("../../decorators");

const router = express.Router();

router.post("/users/register", validate(registerSchema), register);

router.post("/users/login", validate(loginSchema), login);

module.exports = router;
