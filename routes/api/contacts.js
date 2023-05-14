const express = require("express");

const router = express.Router();

const {
  getAllContacts,
  getOneById,
  addToContacts,
  deleteContact,
  updateContact,
} = require("../../controllers/contactsController");

router.get("/", getAllContacts);

router.get("/:contactId", getOneById);

router.post("/", addToContacts);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updateContact);

module.exports = router;
