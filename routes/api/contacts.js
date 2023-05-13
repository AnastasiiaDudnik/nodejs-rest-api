const express = require("express");
const Joi = require("joi");
const router = express.Router();

const {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  // removeContact,
} = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
      throw HttpError(404, `Contact with id "${contactId}" not found`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const result = await addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await updateContactById(contactId, req.body);

    if (!result) {
      throw HttpError(404, `Contact with id "${contactId}" not found`);
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
