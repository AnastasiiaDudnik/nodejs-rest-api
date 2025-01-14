const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getOneById,
  addToContacts,
  deleteContact,
  updateContact,
  updateFavorite,
} = require("../../controllers/contactsController");

const {
  contactAddSchema,
  updateFavoriteSchema,
} = require("../../schemas/contactsValidate");

const { isValidId, authenticate } = require("../../middlewares");
const { validate } = require("../../decorators");

router.use(authenticate);

router.get("/", getAllContacts);

router.get("/:contactId", isValidId, getOneById);

router.post("/", validate(contactAddSchema), addToContacts);

router.put("/:contactId", isValidId, validate(contactAddSchema), updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validate(updateFavoriteSchema),
  updateFavorite
);

router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;
