const express = require("express");

const {
  register,
  verify,
  login,
  getCurrent,
  updateSubscription,
  updateAvatar,
  logout,
} = require("../../controllers/userController");

const { registerSchema, loginSchema } = require("../../schemas/userValidate");
const { validate } = require("../../decorators");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.get("/verify/:verificationToken", verify);

router.post("/login", validate(loginSchema), login);

router.get("/current", authenticate, getCurrent);

router.patch("/", authenticate, updateSubscription);

router.patch(
  "/avatars",
  upload.single("avatarURL"),
  authenticate,
  updateAvatar
);

router.post("/logout", authenticate, logout);

module.exports = router;
