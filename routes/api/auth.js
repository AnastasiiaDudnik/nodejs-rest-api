const express = require("express");

const { register } = require("../../controllers/userController");

const { registerSchema } = require("../../schemas/userValidate");
const { validate } = require("../../decorators");

const router = express.Router();

router.post("/users/register", validate(registerSchema), register);

module.exports = router;
