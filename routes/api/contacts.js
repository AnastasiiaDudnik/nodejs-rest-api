const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getOneById,
  addToContacts,
  deleteContact,
  updateContact,
} = require("../../controllers/contactsController");

const { contactAddSchema } = require("../../schemas/contactsValidate");
const { validate } = require("../../decorators");

router.get("/", getAllContacts);

router.get("/:contactId", getOneById);

router.post("/", validate(contactAddSchema), addToContacts);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", validate(contactAddSchema), updateContact);

module.exports = router;
