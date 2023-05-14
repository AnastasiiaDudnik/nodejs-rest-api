const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  updateContactById,
  removeContact,
} = require("../models/contacts");

const { HttpError } = require("../helpers");
const { controllerWrap } = require("../decorators");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  phone: Joi.string().required(),
});

const getAllContacts = async (req, res) => {
  const result = await listContacts();
  res.json(result);
};

const getOneById = async (req, res) => {
  const { contactId } = req.params;
  const result = await getContactById(contactId);

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json(result);
};

const addToContacts = async (req, res, next) => {
  const { error } = contactAddSchema.validate(req.body);

  if (error) {
    throw HttpError(400, error.message);
  }

  const result = await addContact(req.body);
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await removeContact(contactId);

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res, next) => {
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
};

module.exports = {
  getAllContacts: controllerWrap(getAllContacts),
  getOneById: controllerWrap(getOneById),
  addToContacts: controllerWrap(addToContacts),
  deleteContact: controllerWrap(deleteContact),
  updateContact: controllerWrap(updateContact),
};
